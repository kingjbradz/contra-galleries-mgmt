"use client";

import { useState, useEffect, useRef } from "react";
import {
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  Typography,
  Box,
  InputLabel,
  FormControl,
} from "@mui/material";
// Client-side client for fetching dropdown data
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { createArtworkAction } from "@/lib/artworkActions";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function AddArtworkForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const {
    selectedFiles,
    setSelectedFiles,
    previews,
    setPreviews,
    isProcessing,
    handleFileChange,
    removeImage,
    makeCover,
  } = useImageUpload();
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [selectedArtistName, setSelectedArtistName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Load artists from Supabase on mount
  useEffect(() => {
    const loadArtists = async () => {
      const { data } = await supabase
        .from("artists")
        .select("id, name")
        .order("name");
      if (data) setArtists(data);
    };
    loadArtists();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    setSubmitting(true);
    const formData = new FormData(formRef.current);

    formData.delete("images");

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const result = await createArtworkAction(formData);

    setSubmitting(false);
    if (!result?.error) {
      formRef.current.reset();
      setSelectedFiles([]);
      setPreviews([]);
      onSuccess?.();
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ width: "100%", mx: "auto" }}>
        {/* Artist Selection */}
        <FormControl fullWidth required>
          <InputLabel id="artist-select-label">Artist</InputLabel>
          <Select
            name="artist_id"
            labelId="artist-select-label"
            defaultValue=""
            label="Artist"
            onChange={(e) => {
              const artist = artists.find(a => a.id === e.target.value);
              setSelectedArtistName(artist?.name || "");
            }}
          >
            {artists.map((artist) => (
              <MenuItem key={artist.id} value={artist.id}>
                {artist.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* set artist name */}
        <input type="hidden" name="artist_name" value={selectedArtistName} /> 
        <TextField name="title" label="Artwork Title" required fullWidth />

        <Stack direction="row" spacing={2}>
          <TextField name="year" label="Year" required fullWidth />
          <TextField name="price" label="Price (e.g. 500)" required fullWidth />
        </Stack>

        <TextField
          name="material"
          label="Material / Medium"
          required
          fullWidth
        />
        <TextField
          name="dimensions"
          label="Dimensions (e.g. 24x36in)"
          required
          fullWidth
        />

        <TextField
          name="slug"
          label="URL path/'slug'"
          placeholder="e.g. spring-collection-2026"
          required
          helperText={`URL looks like: ${process.env.NEXT_PUBLIC_QRCODE_URL}/exhibition-name/artwork-name`}
          inputProps={{
            // Browser-level validation for lowercase, numbers, and hyphens
            pattern: "[a-z0-9-]+",
            style: { textTransform: 'lowercase' }
          }}
        />

        <TextField
          name="info"
          label="Artwork Description / Info"
          multiline
          rows={3}
          fullWidth
        />


        <FormControlLabel
          control={<Checkbox name="signed" value="true" />}
          label="Is this work signed by the artist?"
        />

        {/* Image Upload Area */}
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
            Upload Images
          </Typography>

          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Add Photos
            <input
              type="file"
              name="images"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {/* Horizontal Scroll for Previews */}
          {previews.length > 0 && (
            <Stack
              direction="row"
              spacing={2}
              sx={{ overflowX: "auto", py: 1 }}
            >
              {selectedFiles.map((file, index) => {
                const url = previews[index];
                return (
                  <Box key={url} sx={{ position: "relative", flexShrink: 0 }}>
                    <Image
                      src={url}
                      alt="Preview"
                      height={120}
                      width={120}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        border:
                          index === 0 ? "2px solid #1976d2" : "1px solid #ddd",
                      }}
                    />

                    {/* THE COVER BADGE */}
                    {index === 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bgcolor: "primary.main",
                          color: "white",
                          px: 1,
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                          borderRadius: "8px 0 8px 0",
                          zIndex: 1,
                        }}
                      >
                        COVER
                      </Box>
                    )}

                    {/* ACTION BUTTONS */}
                    <Stack
                      direction="row"
                      sx={{ position: "absolute", bottom: 4, right: 4 }}
                      spacing={0.5}
                    >
                      {index > 0 && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => makeCover(index)}
                          sx={{
                            minWidth: 0,
                            p: 0.5,
                            fontSize: "0.6rem",
                            bgcolor: "success.main",
                          }}
                        >
                          ⭐
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => removeImage(index)}
                        sx={{ minWidth: 0, p: 0.5, fontSize: "0.6rem" }}
                      >
                        ✕
                      </Button>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting || isProcessing || selectedFiles.length === 0}
          sx={{ py: 1.5 }}
        >
          {isProcessing
            ? "Processing Images..."
            : submitting
            ? "Saving to Database..."
            : "Add Artwork"}
        </Button>
      </Stack>
    </form>
  );
}
