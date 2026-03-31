'use client';

import { useState } from 'react';
import { Button } from '@mui/material';

export function DownloadPDFButton({ exhibitionId, exhibitionName }: { exhibitionId: string, exhibitionName: string }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // 1. Call the API Route we built
      const response = await fetch(`/api/exhibitions/${exhibitionId}/pdf`);
      
      if (!response.ok) throw new Error('PDF generation failed');

      // 2. Receive the PDF as a Blob
      const blob = await response.blob();
      
      // 3. Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Labels-${exhibitionName.replace(/\s+/g, '-')}.pdf`;
      
      document.body.appendChild(a);
      a.click();
      
      // 4. Cleanup
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to generate labels. Make sure the dev server is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <Button 
        onClick={handleDownload} 
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating PDF...' : 'Download Labels PDF'}
      </Button>
  );
}