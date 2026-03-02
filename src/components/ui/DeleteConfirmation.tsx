import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useState } from "react";

export type DeleteableType = 'artwork' | 'artist' | 'exhibition' | 'user';

interface DeleteConfirmationProps {
  type: DeleteableType;
  // Use a Promise-returning function type so we can await the action
  action: () => Promise<{ success?: boolean; error?: string }>;
  onSuccess: () => void;
}

export default function DeleteConfirmation({ 
  type, 
  onSuccess, 
  action 
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // You can derive specific messages based on the type
  const getWarningMessage = () => {
    switch (type) {
      case 'artist':
        return "Deleting an artist will also hide all their associated artworks.";
      case 'artwork':
        return "This will permanently remove the image files from storage.";
      default:
        return "This action cannot be undone.";
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await action();
      if (result?.success) {
        onSuccess();
      } else {
        alert(result?.error || "An unknown error occurred");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center', minWidth: 300 }}>
      <Typography variant="h6" color="error" gutterBottom>
        Confirm Deletion
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Are you sure you want to delete this **{type}**?
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
        {getWarningMessage()}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <CircularProgress size={24} color="inherit" /> : `Yes, Delete`}
        </Button>
      </Box>
    </Box>
  );
}