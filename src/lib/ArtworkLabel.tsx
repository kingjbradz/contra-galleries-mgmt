// import QRCodeImage from "./QRCodeImage";
import { Artwork } from "@/app/(protected)/artworks/page";
import Image from "next/image";

interface ArtworkLabelProps {
  artwork: Artwork;
  staticQr?: string ;
}

export default function ArtworkLabel({ artwork, staticQr }: ArtworkLabelProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', width: '70mm', breakInside: 'avoid' }}>
      
      {/* Left Column: Artwork Info */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '15.5px', fontWeight: 'bold', margin: '0 0 1mm 0' }}>
          {artwork.title ? artwork.title : "Untitled"}
        </p>
        <p style={{ fontSize: '12.5px', fontStyle: 'italic', margin: '0 0 1mm 0' }}>
          {artwork.artist_name ? artwork.artist_name : "Unknown Artist"}, {artwork.year}
        </p>
        <p style={{ fontSize: '12.5px', margin: '0 0 1mm 0' }}>
          {artwork.material}
        </p>
      </div>

      {/* Right Column: QR Code */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: '60px', height: '60px' }}>
    
          {staticQr && <Image 
            src={staticQr} 
            style={{ width: '60px', height: '60px' }} 
            alt="QR" 
          />}
       
        </div>
      </div>

    </div>
  );
}