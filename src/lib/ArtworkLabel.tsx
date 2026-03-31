// import QRCodeImage from "./QRCodeImage";
import { Artwork } from "@/app/(protected)/artworks/page";
import React, { Suspense, lazy } from 'react';

interface ArtworkLabelProps {
  artwork: Artwork;
  exhibitionSlug: string;
  staticQr?: string;
}

const QRCodeImage = lazy(() => import('@/lib/QRCodeImage'));

export default function ArtworkLabel({ artwork, exhibitionSlug, staticQr }: ArtworkLabelProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', width: '70mm', breakInside: 'avoid' }}>
      
      {/* Left Column: Artwork Info */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '15.5px', fontWeight: 'bold', margin: '0 0 1mm 0' }}>
          {artwork.title}
        </p>
        <p style={{ fontSize: '12.5px', fontStyle: 'italic', margin: '0 0 1mm 0' }}>
          {artwork.artist_name}, {artwork.year}
        </p>
        <p style={{ fontSize: '12.5px', margin: '0 0 1mm 0' }}>
          {artwork.material}
        </p>
      </div>

      {/* Right Column: QR Code */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: '60px', height: '60px' }}>
    
          <img 
            src={staticQr} 
            style={{ width: '60px', height: '60px' }} 
            alt="QR" 
          />
       
        </div>
      </div>

    </div>
  );
}