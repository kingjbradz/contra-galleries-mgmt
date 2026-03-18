'use server'

// @ts-ignore
import heicConvert from 'heic-convert'
import sharp from 'sharp';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from './r2Client';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; 

export async function getArtworks() {
  const { data, error } = await supabaseAdmin
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Fetch Artworks Error:", error);
    return [];
  }

  return data;
}

export async function getArtwork(id: string) {
  const { data, error } = await supabaseAdmin
    .from('artworks')
    .select(`
      *,
      artist_name:artists(name),
      artwork_images (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console?.log("Fetch Individual Artwork Error:", error);
    return null;
  }

  return {
    ...data,
    artist_name: data.artist_name.name ?? "Unknown Artist",
    artwork_images: data.artwork_images ?? []
  }
}

export async function getArtworkImages(artworkId: string) {
  const { data, error } = await supabaseAdmin
  .from('artwork_images')
  .select('*')
  .eq('artwork_id', artworkId)
  .order('created_at', { ascending: true });

if (error) {
  console?.error("Fetch Artwork Images Error:", error);
  return [];
}

return data;
}

export async function getArtworksByArtist(artistId: string) {
  const { data, error } = await supabaseAdmin
    .from('artworks')
    .select(`
      *,
      artwork_images (
        url,
        is_cover
      )
    `)
    .eq('artist_id', artistId)
    // This is the correct way to filter the JOINED table
    .eq('artwork_images.is_cover', true) 
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching artist artworks:", error);
    return [];
  }

  // Flatten for your clean JSON preference
  return data.map(artwork => ({
    ...artwork,
    cover_url: artwork.artwork_images?.[0]?.url || null,
    artwork_images: undefined 
  }));
}

export async function createArtworkAction(formData: FormData) {
  try {
    // 1. Create the artwork record first
    const { data: artwork, error: artError } = await supabaseAdmin
      .from('artworks')
      .insert({
        artist_id: formData.get('artist_id'),
        artist_name: formData.get('artist_name'),
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
  try {
    // 1. Update Text Metadata in Supabase
    const { error: updateError } = await supabaseAdmin
      .from('artworks')
      .update({
        title: formData.get('title'),
        artist_name: formData.get('artist_name'),
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

    // 3. IDENTIFY ORPHANS (The New Part)
    // Get currently stored images before we delete them from the DB
    const { data: currentImages } = await supabaseAdmin
      .from('artwork_images')
      .select('url')
      .eq('artwork_id', artworkId);

    const keptRemoteUrls = formData.getAll('keptImages') as string[];
    
    if (currentImages) {
      // Find URLs that exist in DB but are NOT in the "kept" list from the form
      const urlsToDelete = currentImages
        .map(img => img.url)
        .filter(url => !keptRemoteUrls.includes(url));

      // Delete orphans from R2
      for (const url of urlsToDelete) {
        try {
          // Extract the 'key' from the public URL
          // If public URL is https://pub-xyz.r2.dev/artworks/id/file.webp
          // The Key is: artworks/id/file.webp
          const key = url.split(`${process.env.R2_PUBLIC_URL}/`)[1];
          
          if (key) {
            await r2.send(new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: key,
            }));
          }
        } catch (s3Err) {
          console.error("Failed to delete orphaned R2 object:", url, s3Err);
          // We don't throw here; we want the DB update to finish even if R2 cleanup fails
        }
      }
    }

    // 4. Reconcile Order (The "Easy" Way)
    // imageOrder is a JSON string of URLs (for existing) and 'new' placeholders
    const orderMap = JSON.parse(formData.get('imageOrder') as string);

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

    // 5. Sync Database
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

export async function deleteArtworkAction(artworkId: string) {
  try {
    // 1. Get all image URLs from the DB before we delete the records
    // This ensures we know exactly what to scrub from R2
    const { data: images } = await supabaseAdmin
      .from('artwork_images')
      .select('url')
      .eq('artwork_id', artworkId);

    // 2. Delete the Artwork Record
    // If your DB has "ON DELETE CASCADE" set up for the artwork_images foreign key, 
    // the image rows will vanish automatically. If not, delete them manually first.
    const { error: dbError } = await supabaseAdmin
      .from('artworks')
      .delete()
      .eq('id', artworkId);

    if (dbError) throw dbError;

    // 3. Scrub R2 Storage
    if (images && images.length > 0) {
      for (const img of images) {
        const key = img.url.split(`${process.env.R2_PUBLIC_URL}/`)[1];
        if (key) {
          await r2.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
          }));
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Delete Error:", err);
    return { error: err.message };
  }
}