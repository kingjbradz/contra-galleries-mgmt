'use server'

//@ts-ignore
import heicConvert from 'heic-convert'
import sharp from 'sharp';
import { r2 } from './r2Client';
import { supabaseAdmin } from './supabaseAdmin';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';

export async function getExhibitions() {
  const { data, error } = await supabaseAdmin
    .from('exhibitions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Fetch Exhibitions Error:", error);
    return [];
  }

  return data;
}

export async function getExhibiton(id: string) {
  const { data, error } = await supabaseAdmin
    .from('exhibitons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Fetch Individual Exhibition Error:", error);
    return null;
  }

  return data;
}

export async function createExhibitionAction(formData: FormData) {
  try {
    // 1. Create the exhibition record first
    const { data: exhibition, error: exError } = await supabaseAdmin
      .from('exhibitions')
      .insert({
        name: formData.get('name'),
        description: formData.get('description'),
        private: formData.get('private') === 'true',
        public: formData.get('public') === 'true',
        onsite: formData.get('onsite') === 'true',
      })
      .select()
      .single();

    if (exError) throw new Error(`Database Error: ${exError.message}`);

    const coverFile = formData.get('cover_image') as File;

    // 2. Process single cover image if it exists
    if (coverFile && coverFile.size > 0) {
      const arrayBuffer = await coverFile.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);

      // Convert HEIC if necessary
      if (coverFile.name.toLowerCase().endsWith('.heic')) {
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

      // Simplified key using the exhibitions directory
      const key = `exhibitions/${exhibition.id}/${Date.now()}-cover.webp`;

      // Upload to R2
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: optimized,
        ContentType: 'image/webp',
      }));

      const coverUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

      // 3. Update the exhibition record with the single cover URL
      const { error: updateError } = await supabaseAdmin
        .from('exhibitions')
        .update({ cover_image: coverUrl })
        .eq('id', exhibition.id);

      if (updateError) throw updateError;
    }

    // Inside createExhibitionAction
const artworkIds = JSON.parse(formData.get("artwork_ids") as string);

if (artworkIds.length > 0) {
  const joinData = artworkIds.map((artId: string) => ({
    exhibition_id: exhibition.id,
    artwork_id: artId
  }));

  const { error: joinError } = await supabaseAdmin
    .from("exhibition_artworks")
    .insert(joinData);

  if (joinError) throw joinError;
}

    revalidatePath('/exhibitions');
    return { success: true, data: exhibition };
  } catch (err: any) {
    console.error("Exhibition Create Error:", err);
    return { error: err.message || "An unknown error occurred during upload." };
  }
}

export async function updateExhibitionAction(formData: FormData, exhibitionId: string) {
  try {
    // 1. Fetch current exhibition to get the existing image URL for cleanup
    const { data: currentExh } = await supabaseAdmin
      .from('exhibitions')
      .select('cover_image')
      .eq('id', exhibitionId)
      .single();

    const newFile = formData.get('cover_image') as File;
    let finalImageUrl = currentExh?.cover_image;

    // 2. Handle Image Update
    if (newFile && newFile.size > 0) {
      // Optimize (using your Sharp/HEIC logic)
      const arrayBuffer = await newFile.arrayBuffer();
      const optimized = await sharp(Buffer.from(arrayBuffer))
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      const key = `exhibitions/${exhibitionId}/${Date.now()}.webp`;

      // Upload New
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: optimized,
        ContentType: 'image/webp',
      }));

      // Delete Old from R2 if it exists
      if (currentExh?.cover_image) {
        const oldKey = currentExh.cover_image.split(`${process.env.R2_PUBLIC_URL}/`)[1];
        if (oldKey) {
          await r2.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: oldKey,
          }));
        }
      }
      finalImageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    }

    // 3. Update Exhibition Metadata
    const { error: updateError } = await supabaseAdmin
      .from('exhibitions')
      .update({
        name: formData.get('name'),
        description: formData.get('description'),
        public: formData.get('public') === 'true',
        private: formData.get('private') === 'true',
        onsite: formData.get('onsite') === 'true',
        cover_image: finalImageUrl,
      })
      .eq('id', exhibitionId);

    if (updateError) throw updateError;

    // 4. Sync Artworks (The Join Table)
    const artworkIds = JSON.parse(formData.get('artwork_ids') as string || "[]");

    // Clear existing and re-insert
    await supabaseAdmin.from('exhibition_artworks').delete().eq('exhibition_id', exhibitionId);
    
    if (artworkIds.length > 0) {
      const joinData = artworkIds.map((artId: string) => ({
        exhibition_id: exhibitionId,
        artwork_id: artId,
      }));
      await supabaseAdmin.from('exhibition_artworks').insert(joinData);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Exhibition Update Error:", err);
    return { error: err.message };
  }
}

export async function deleteExhibitionAction(exhibitionId: string) {
  try {
    // 1. Fetch the cover image URL first
    // We do this BEFORE deleting the record so we have the R2 key
    const { data: exhibition } = await supabaseAdmin
      .from('exhibitions')
      .select('cover_image')
      .eq('id', exhibitionId)
      .single();

    // 2. Clear the Join Table (Safety Check)
    // Even with CASCADE, manual deletion ensures no orphaned links remain 
    // if the DB constraints are updated later.
    await supabaseAdmin
      .from('exhibition_artworks')
      .delete()
      .eq('exhibition_id', exhibitionId);

    // 3. Delete the Exhibition Record
    const { error: dbError } = await supabaseAdmin
      .from('exhibitions')
      .delete()
      .eq('id', exhibitionId);

    if (dbError) throw dbError;

    // 4. Scrub R2 Storage
    if (exhibition?.cover_image) {
      const key = exhibition.cover_image.split(`${process.env.R2_PUBLIC_URL}/`)[1];
      
      if (key) {
        try {
          await r2.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
          }));
        } catch (r2Err) {
          // We log R2 errors but don't fail the action, 
          // as the DB record is already gone.
          console.error("Failed to scrub R2 for exhibition:", exhibitionId, r2Err);
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Exhibition Delete Error:", err);
    return { error: err.message || "Failed to delete exhibition." };
  }
}