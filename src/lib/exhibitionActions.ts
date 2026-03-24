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