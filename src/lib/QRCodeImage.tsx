'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeImageProps {
  exhibitionSlug?: string;
  artworkSlug?: string;
}

export default function QRCodeImage({ exhibitionSlug, artworkSlug }: QRCodeImageProps) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    // This matches the logic from your generateArtworkQR function
    const baseUrl = process.env.NEXT_PUBLIC_QRCODE_URL
    const fullUrl = `${baseUrl}/${exhibitionSlug}/${artworkSlug}`;

    QRCode.toDataURL(fullUrl, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
    .then(setSrc)
    .catch(err => console.error("QR Generation Error:", err));
  }, [exhibitionSlug, artworkSlug]);

  if (!src) return null; // Or a small skeleton loader

  return (
    <img 
      src={src} 
      alt={`QR Code for ${artworkSlug}`} 
      style={{ width: '100%', maxWidth: '300px', display: 'block' }} 
    />
  );
}