"use client";

import { useState, useEffect, useRef } from "react";
import {
  Alert,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
// Client-side client for fetching dropdown data
import { supabase } from "@/lib/supabaseClient";
// Our Server Action logic
import { createExhibitionAction } from "@/lib/exhibitionActions";
import { useImageUpload } from "@/hooks/useImageUpload";
import ModalButton from "@/components/ui/ModalButton";
import ArtworkSelector from "@/components/ui/ArtworkSelector";


interface ExhibitionFormProps {
  onSuccess?: () => void;
}

export default function ExhibitionForm({ onSuccess }: ExhibitionFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);
  const [availableArtworks, setAvailableArtworks] = useState<any[]>([]);

  // 1. Load artworks so we can pick them
  useEffect(() => {
    const loadArtworks = async () => {
      const { data } = await supabase
        .from("artworks")
        .select("id, title, artist_name, artwork_images(url)")
        .order("created_at", { ascending: false });
      if (data) setAvailableArtworks(data);
    };
    loadArtworks();
  }, []);

  const toggleArtwork = (id: string) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Reuse your established hook pattern
  const {
    selectedFiles,
    previews,
    handleFileChange,
    removeImage,
    isProcessing,
    setSelectedFiles,
    setPreviews,
  } = useImageUpload();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. Safety check - ensures the form exists before we try to read it
    if (!formRef.current) return;

    setSubmitting(true);
    setError(null);

    // 2. Initialize FormData ONLY here
    const formData = new FormData(formRef.current);

    // 3. Handle the single cover image (following your selectedFiles pattern)
    if (selectedFiles.length > 0) {
      formData.set("cover_image", selectedFiles[0]);
    }

    // 4. Handle the artwork IDs
    // We use JSON.stringify if your Action is expecting a single string to parse
    // OR we use a loop with .append if your Action uses .getAll()
    formData.append("artwork_ids", JSON.stringify(selectedArtworkIds));

    // 5. Send to Action
    const result = await createExhibitionAction(formData);

    setSubmitting(false);
    if (result?.error) {
      setError(result.error);
    } else {
      // Cleanup
      formRef.current.reset();
      setSelectedFiles([]);
      setPreviews([]);
      setSelectedArtworkIds([]); // Clear the selected artworks too
      onSuccess?.();
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField name="name" label="Exhibition Name" required fullWidth />

        <TextField
          name="description"
          label="Description / Info"
          multiline
          rows={4}
          fullWidth
        />

        {/* Visibility & Location Flags */}
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox name="public" value="true" />}
            label="Public"
          />
          <FormControlLabel
            control={<Checkbox name="private" value="true" />}
            label="Private"
          />
          <FormControlLabel
            control={<Checkbox name="onsite" value="true" />}
            label="Onsite"
          />
        </Stack>

        {/* Single Image Upload Area */}
        <Box
          sx={{
            p: 3,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            textAlign: "center",
            bgcolor: "grey.50",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Exhibition Cover Image
          </Typography>

          {previews.length === 0 ? (
            <Button variant="outlined" component="label">
              Upload Photo
              <input
                type="file"
                name="cover_image"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          ) : (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <img
                src={previews[0]}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: 250,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => removeImage(0)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  minWidth: 0,
                  p: 0.5,
                }}
              >
                ✕
              </Button>
            </Box>
          )}
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Select Artworks ({selectedArtworkIds.length})
        </Typography>



        <ModalButton
          label={
            selectedArtworkIds.length > 0
              ? `Edit Artworks (${selectedArtworkIds.length})`
              : "Select Artworks"
          }
          title="Select Artworks"
          variant="outlined"
        >
          {(close) => (
            <ArtworkSelector
              initialSelectedIds={selectedArtworkIds}
              onConfirm={(newIds) => {
                setSelectedArtworkIds(newIds);
                close(); // This is the trigger to shut the modal
              }}
            />
          )}
        </ModalButton>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting || isProcessing || selectedFiles.length === 0}
          sx={{ py: 1.5 }}
        >
          {isProcessing
            ? "Processing Image..."
            : submitting
            ? "Creating Exhibition..."
            : "Create Exhibition"}
        </Button>
      </Stack>
    </form>
  );
}
