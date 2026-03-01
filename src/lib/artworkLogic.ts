'use server'

// @ts-ignore
import heicConvert from 'heic-convert'
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; 

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function createArtworkAction(formData: FormData) {
  try {
    // 1. Create the artwork record first
    const { data: artwork, error: artError } = await supabaseAdmin
      .from('artworks')
      .insert({
        artist_id: formData.get('artist_id'),
        title: formData.get('title'),
        year: formData.get('year'),
        material: formData.get('material'),
        dimensions: formData.get('dimensions'),
        info: formData.get('info'),
        price: formData.get('price'),
        signed: formData.get('signed') === 'true',
      })
      .select().single();

    if (artError) throw new Error(`Database Error: ${artError.message}`);

    const imageFiles = formData.getAll('images') as File[];
    const imageData = [];

    // 2. Process images SEQUENTIALLY to prevent CPU spikes/timeouts
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const arrayBuffer = await file.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);

      // Convert HEIC if necessary
      if (file.name.toLowerCase().endsWith('.heic')) {
        console.log(`Converting HEIC: ${file.name}`);
        const converted = await heicConvert({
          buffer: buffer,
          format: 'JPEG',
          quality: 0.8 // Lowering quality slightly here speeds up the process significantly
        });
        buffer = Buffer.from(converted);
      }

      // Optimize with Sharp
      const optimized = await sharp(buffer)
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 }) // 75 is the sweet spot for file size vs quality
        .toBuffer();

      const key = `artworks/${artwork.id}/${Date.now()}-${i}.webp`;

      // Upload to R2
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: optimized,
        ContentType: 'image/webp',
      }));

      imageData.push({
        artwork_id: artwork.id,
        url: `${process.env.R2_PUBLIC_URL}/${key}`,
        is_cover: i === 0
      });
      
      console.log(`Finished image ${i + 1} of ${imageFiles.length}`);
    }

    // 3. Link all images at once
    const { error: imgError } = await supabaseAdmin
      .from('artwork_images')
      .insert(imageData);

    if (imgError) throw imgError;

    return { success: true };
  } catch (err: any) {
    console.error("Detailed Upload Error:", err);
    return { error: err.message || "An unknown error occurred during upload." };
  }
}

export async function updateArtworkAction(formData: FormData, artworkId: string) {
  console.log("formdata in artworkLogic 97", formData)
  try {
    // 1. Update Text Metadata in Supabase
    const { error: updateError } = await supabaseAdmin
      .from('artworks')
      .update({
        title: formData.get('title'),
        artist_id: formData.get('artist_id'),
        year: formData.get('year'),
        material: formData.get('material'),
        dimensions: formData.get('dimensions'),
        info: formData.get('info'),
        price: formData.get('price'),
        signed: formData.get('signed') === 'true',
      })
      .eq('id', artworkId);

    if (updateError) throw new Error(`Metadata Update Failed: ${updateError.message}`);

    // 2. Process NEW Image Files
    const newFiles = formData.getAll('images') as File[];
    const uploadedUrls: string[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (file.size === 0) continue; // Safety check

      const arrayBuffer = await file.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);

      // HEIC to JPEG Guardrail
      if (file.name.toLowerCase().endsWith('.heic')) {
        const converted = await heicConvert({
          buffer: buffer,
          format: 'JPEG',
          quality: 0.8
        });
        buffer = Buffer.from(converted);
      }

      // Optimize with Sharp
      const optimized = await sharp(buffer)
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      const key = `artworks/${artworkId}/${Date.now()}-${i}.webp`;

      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: optimized,
        ContentType: 'image/webp',
      }));

      uploadedUrls.push(`${process.env.R2_PUBLIC_URL}/${key}`);
    }

    // 3. Reconcile Order (The "Easy" Way)
    // imageOrder is a JSON string of URLs (for existing) and 'new' placeholders
    const orderMap = JSON.parse(formData.get('imageOrder') as string);
    const keptRemoteUrls = formData.getAll('keptImages') as string[];

    let newFileIndex = 0;
    const finalImageRows = orderMap.map((identifier: string, index: number) => {
      // Determine if this slot belongs to an existing URL or one we just uploaded
      const url = identifier === 'new' ? uploadedUrls[newFileIndex++] : identifier;
      
      return {
        artwork_id: artworkId,
        url: url,
        is_cover: index === 0 // First image in the list is always the cover
      };
    });

    // 4. Sync Database
    // Delete all previous image links and insert the new ordered set
    await supabaseAdmin.from('artwork_images').delete().eq('artwork_id', artworkId);
    
    if (finalImageRows.length > 0) {
      const { error: imgError } = await supabaseAdmin
        .from('artwork_images')
        .insert(finalImageRows);
      if (imgError) throw imgError;
    }

    return { success: true };
  } catch (err: any) {
    console.error("Update Error:", err);
    return { error: err.message || "An error occurred while updating the artwork." };
  }
}