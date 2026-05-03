import { useState, ChangeEvent } from 'react';
import heic2any from 'heic2any';

export function useImageUpload(initialRemoteUrls: string[] = []) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Previews will hold both local 'blob:' URLs and remote 'https://' URLs
  const [previews, setPreviews] = useState<string[]>(initialRemoteUrls);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsProcessing(true);
      const newFiles = Array.from(e.target.files);
      const newPreviews: string[] = [];

      for (const file of newFiles) {
        if (file.name.toLowerCase().endsWith('.heic')) {
          const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.3 });
          const finalBlob = Array.isArray(blob) ? blob[0] : blob;
          newPreviews.push(URL.createObjectURL(finalBlob));
        } else {
          newPreviews.push(URL.createObjectURL(file));
        }
      }

      setSelectedFiles(prev => [...prev, ...newFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    const urlToRemove = previews[index];
    
    // If it's a local file, we must remove it from selectedFiles too
    if (urlToRemove.startsWith('blob:')) {
      // We need to find the index within the selectedFiles array specifically
      // Local files are usually added to the end of previews
      const localIndex = previews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== localIndex));
      URL.revokeObjectURL(urlToRemove);
    }

    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

 const makeCover = (index: number) => {
  // Move preview
  setPreviews(prev => {
    const newOrder = [...prev];
    const [item] = newOrder.splice(index, 1);
    newOrder.unshift(item);
    return newOrder;
  });

  // Move corresponding file if it exists
  const url = previews[index];
  if (url.startsWith('blob:')) {
    setSelectedFiles(prev => {
       // logic to find and move the matching File object
       return prev; 
    });
  }
};

  const resetImages = () => {
    previews.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
  };

  return {
    selectedFiles,
    setSelectedFiles,
    setPreviews,
    previews,
    isProcessing,
    handleFileChange,
    removeImage,
    makeCover,
    resetImages
  };
}