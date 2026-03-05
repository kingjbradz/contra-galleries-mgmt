'use server'

import { supabaseAdmin } from './supabaseAdmin';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from './r2Client'; 
import { revalidatePath } from 'next/cache';

export async function createArtistAction(artistData: { 
  name: string; 
  notes?: string; 
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('artists')
      .insert([artistData])
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/artists'); // Clears cache for the artists list
    return { success: true, data };
  } catch (err: any) {
    console.error("Create Artist Error:", err);
    return { error: err.message || "Failed to create artist" };
  }
}

export async function updateArtistAction(id: string, artistData: {
  name: string;
  notes?: string;
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('artists')
      .update(artistData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/artists');
    return { success: true, data };
  } catch (err: any) {
    console.error("Update Artist Error:", err);
    return { error: err.message || "Failed to update artist" };
  }
}
export async function deleteArtistAction(artistId: string) {
  try {
    // 1. Find all artworks belonging to this artist
    const { data: artworks, error: fetchError } = await supabaseAdmin
      .from('artworks')
      .select('id')
      .eq('artist_id', artistId);

    if (fetchError) throw fetchError;

    // 2. For each artwork, clean up its images in R2
    if (artworks && artworks.length > 0) {
      for (const artwork of artworks) {
        // Get URLs for this specific artwork
        const { data: images } = await supabaseAdmin
          .from('artwork_images')
          .select('url')
          .eq('artwork_id', artwork.id);

        if (images) {
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
      }
    }

    // 3. Delete the Artist (and cascade to Artworks in DB)
    // NOTE: This assumes your DB has "ON DELETE CASCADE" on the artist_id 
    // foreign key in the 'artworks' table.
    const { error: deleteError } = await supabaseAdmin
      .from('artists')
      .delete()
      .eq('id', artistId);

    if (deleteError) throw deleteError;

    revalidatePath('/artists');
    return { success: true };
    
  } catch (err: any) {
    console.error("Deep Delete Artist Error:", err);
    return { error: err.message || "Failed to fully delete artist and associated data" };
  }
}