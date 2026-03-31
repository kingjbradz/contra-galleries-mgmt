import { supabase } from '@/lib/supabaseClient';
import ArtworkLabel from '@/lib/ArtworkLabel';
import { notFound } from 'next/navigation';

export default async function PDFLayoutPage({ params }: { params: { id: string } }) {

  // 1. Fetch data
  const { data: exhibition, error } = await supabase
    .from('exhibitions')
    .select(`*, artworks (*)`)
    .eq('id', params.id)
    .single();

  if (error || !exhibition) return notFound();

  return (
    <div style={{
      width: '8.5in', // Matches US Letter
      margin: '0',
      padding: '0.5in',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 70mm)', // Our 3-across grid
      gap: '10mm',
      backgroundColor: '#fff',
    }}>
      {/* 2. Global "Print-Style" CSS for the Headless Engine */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; padding: 0; background: white; }
        @page { size: letter; margin: 0; }
        * { -webkit-print-color-adjust: exact; }
      `}} />

      {/* 3. Map the labels */}
      {exhibition.artworks.map((artwork: any) => (
        <ArtworkLabel 
          key={artwork.id} 
          artwork={artwork} 
          exhibitionSlug={exhibition.slug} 
        />
      ))}
    </div>
  );
}