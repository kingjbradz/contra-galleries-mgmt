"use client";

import { useState, useRef } from "react";
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
import { Exhibition } from "@/app/(protected)/exhibitions/page";
import { Artwork } from "@/app/(protected)/artworks/page";
import Image from "next/image";
import { updateExhibitionAction } from "@/lib/exhibitionActions";
import { useImageUpload } from "@/hooks/useImageUpload";
import ModalButton from "@/components/ui/ModalButton";
import ArtworkSelector from "@/components/ui/ArtworkSelector";

interface EditExhibitionFormProps {
  exhibition: Exhibition; // The hydrated exhibition object from the parent
  artworks: Artwork[];
  onSuccess?: () => void; // Injected by React.cloneElement in ActionButtons
}

export default function EditExhibitionForm({
  exhibition,
  artworks,
  onSuccess,
}: EditExhibitionFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize selected IDs from the exhibition's joined artworks
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>(
    artworks.map((a) => a.id).filter((id): id is string => id !== undefined)
  );

  const {
    selectedFiles,
    previews,
    handleFileChange,
    removeImage,
    isProcessing,
  } = useImageUpload();

  // Determine if we show the existing R2 image or a new local preview
  const currentPreview =
    previews.length > 0 ? previews[0] : exhibition.cover_image;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    setSubmitting(true);
    setError(null);

    const formData = new FormData(formRef.current);

    // Append the artwork selection
    formData.append("artwork_ids", JSON.stringify(selectedArtworkIds));

    // Only set a new cover_image if one was actually picked
    if (selectedFiles.length > 0) {
      formData.set("cover_image", selectedFiles[0]);
    }

    const result = await updateExhibitionAction(formData, exhibition.id);

    setSubmitting(false);
    if (result?.error) {
      setError(result.error);
    } else {
      onSuccess?.(); // Closes modal and refreshes router via ActionButtons
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ p: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          name="name"
          label="Exhibition Name"
          defaultValue={exhibition.name}
          required
          fullWidth
        />

        <TextField
          name="description"
          label="Description / Info"
          defaultValue={exhibition.description}
          multiline
          rows={4}
          fullWidth
        />

        <TextField
          name="slug"
          label="URL path/'slug'"
          defaultValue={exhibition.slug}
          required
          helperText={`URL looks like: ${process.env.NEXT_PUBLIC_QRCODE_URL}/${exhibition.slug}/artwork-name`}
          inputProps={{
            // Browser-level validation for lowercase, numbers, and hyphens
            pattern: "[a-z0-9-]+",
            style: { textTransform: "lowercase" },
          }}
        />

        <Stack direction="row" spacing={1} justifyContent="space-between">
          <FormControlLabel
            control={
              <Checkbox
                name="public"
                value="true"
                defaultChecked={exhibition.public}
              />
            }
            label="Public"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="private"
                value="true"
                defaultChecked={exhibition.private}
              />
            }
            label="Private"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="onsite"
                value="true"
                defaultChecked={exhibition.onsite}
              />
            }
            label="Onsite"
          />
        </Stack>

        {/* Cover Image Area */}
        <Box
          sx={{
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Cover Image
          </Typography>
          {currentPreview ? (
            <Box sx={{ position: "relative", width: "100%", height: 250 }}>
              <Image
                src={currentPreview}
                alt="Preview"
                fill
                style={{
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <Button
                onClick={() => {
                  // If we're removing a new file, it clears 'previews'.
                  // If we're "removing" the old image, you might want a different logic,
                  // but for now, let's allow replacing it via the upload button.
                  if (previews.length > 0) removeImage(0);
                }}
                sx={{ display: previews.length > 0 ? "block" : "none" }}
              >
                Remove New Upload
              </Button>
            </Box>
          ) : null}
          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            {currentPreview ? "Replace Image" : "Upload Image"}
            <input
              type="file"
              name="cover_image"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Box>

        <ModalButton
          label={`Select Artworks (${selectedArtworkIds.length})`}
          title="Select Artworks"
          variant="outlined"
        >
          {(close) => (
            <ArtworkSelector
              initialSelectedIds={selectedArtworkIds}
              onConfirm={(newIds) => {
                setSelectedArtworkIds(newIds);
                close();
              }}
            />
          )}
        </ModalButton>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting || isProcessing}
        >
          {submitting ? "Saving..." : "Update Exhibition"}
        </Button>
      </Stack>
    </form>
  );
}
