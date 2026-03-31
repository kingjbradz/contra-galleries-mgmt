import React from 'react';
import ArtworkLabel from '@/lib/ArtworkLabel';

// This would be your Page component (e.g., app/admin/exhibitions/[id]/print/page.tsx)
export default function PrintLabelsPage({ exhibition, artworks }: any) {
  return (
    <>
      {/* 1. Global Print Settings */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: letter; 
            margin: 0.5in; 
          }
          body { 
            margin: 0; 
            padding: 0; 
            background: #fff !important; 
          }
          nav, footer, button { 
            display: none !important; 
          }
        }
      `}} />


      {/* 3. The US Letter Canvas */}
      <div style={{
        width: '8.5in',
        margin: '0 auto',
        padding: '0.2in', // Buffer for the printer's physical margins
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 70mm)', // Your 70mm labels
        columnGap: '5mm', // Adjust based on how you want to cut them
        rowGap: '10mm',
        backgroundColor: '#fff'
      }}>
        {artworks.map((artwork: any) => (
          <ArtworkLabel 
            key={artwork.id} 
            artwork={artwork} 
            exhibitionSlug={exhibition.slug} 
          />
        ))}
      </div>
    </>
  );
}

// FOLLOW UP: figure out server issues with button and clean up mess