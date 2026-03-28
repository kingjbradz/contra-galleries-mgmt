"use client";

import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Checkbox,
  Select,
  MenuItem,
  FormControlLabel,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Artwork, ArtworkImage } from "@/app/(protected)/artworks/page";
import { useImageUpload } from "@/hooks/useImageUpload";
import { updateArtworkAction } from "@/lib/artworkActions";
import { supabase } from "@/lib/supabaseClient";

interface EditArtworkFormProps {
  artwork: Artwork;
  onSuccess?: () => void;
}

export default function EditArtworkForm({
  artwork,
  onSuccess,
}: EditArtworkFormProps) {
  const {
    previews,
    selectedFiles,
    isProcessing,
    handleFileChange,
    removeImage,
    makeCover,
  } = useImageUpload(
    // We map the objects to strings and sort so the cover is first in the UI
    artwork?.artwork_images?.sort((a, b) => (a.is_cover ? -1 : 1)).map((img) => img.url)
  );


  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [editedArtwork, setEditedArtwork] = useState<Artwork>({
    id: artwork.id,
    artist_id: artwork.artist_id,
    title: artwork.title,
    year: artwork.year,
    material: artwork.material,
    dimensions: artwork.dimensions,
    info: artwork.info,
    price: artwork.price,
    signed: artwork.signed,
    slug: artwork.slug,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadArtists = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("id, name")
        .order("name");

      if (!error && data) {
        setArtists(data);
      }
    };

    loadArtists();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // 1. Identify which previews are already in R2 vs. which are new local blobs
      const keptRemoteUrls = previews.filter((url) => !url.startsWith("blob:"));

      // 2. Create the Order Map
      // We send the actual URL for existing images, and the string 'new' for new ones
      const orderMap = previews.map((url) =>
        url.startsWith("blob:") ? "new" : url
      );

      // 3. Sync the 'images' field with our hook's File objects
      // We delete the default browser file input and append our controlled state
      formData.delete("images");
      selectedFiles.forEach((file) => formData.append("images", file));

      // 4. Append the reconciliation data for the server
      // 'keptImages' tells the server which old files NOT to delete/ignore
      keptRemoteUrls.forEach((url) => formData.append("keptImages", url));

      // 'imageOrder' tells the server the final sequence [Cover, 2, 3...]
      formData.append("imageOrder", JSON.stringify(orderMap));

      // 5. Fire off the Server Action
      const result = await updateArtworkAction(formData, artwork.id!);

      if (result?.error) {
        alert(result.error);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Select
          value={editedArtwork.artist_id || ""}
          label="Artist"
          name="artist_id"
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              artist_id: e.target.value,
            })
          }
        >
          {artists.map((artist) => (
            <MenuItem key={artist.id} value={artist.id}>
              {artist.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Title"
          name="title"
          value={editedArtwork.title || ""}
          required
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              title: e.target.value,
            })
          }
        />
        <TextField
          label="Year"
          name="year"
          value={editedArtwork.year || ""}
          required
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              year: e.target.value,
            })
          }
        />
        <TextField
          label="Material"
          name="material"
          value={editedArtwork.material || ""}
          required
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              material: e.target.value,
            })
          }
        />
        <TextField
          label="Dimensions"
          name="dimensions"
          value={editedArtwork.dimensions || ""}
          required
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              dimensions: e.target.value,
            })
          }
        />
        <TextField
          name="slug"
          label="URL path/'slug'"
          value={editedArtwork.slug || ""}
          required
          helperText={`This defines the URL: ${process.env.QRCODE_URL}/slug/artwork-slug`}
          inputProps={{
            // Browser-level validation for lowercase, numbers, and hyphens
            pattern: "[a-z0-9-]+",
            style: { textTransform: 'lowercase' }
          }}
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              dimensions: e.target.value,
            })
          }
        />
        <TextField
          label="Info"
          name="info"
          value={editedArtwork.info || ""}
          multiline
          rows={3}
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              info: e.target.value,
            })
          }
        />
        <TextField
          label="Price"
          name="price"
          value={editedArtwork.price || ""}
          required
          onChange={(e) =>
            setEditedArtwork({
              ...artwork,
              price: e.target.value,
            })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              value={editedArtwork.signed || false}
              name="signed"
              onChange={(e) =>
                setEditedArtwork({
                  ...artwork,
                  signed: e.target.checked,
                })
              }
            />
          }
          label="Signed?"
        />
        {/* IMAGE UPLOAD SECTION */}
        <Button
          variant="outlined"
          component="label"
          disabled={isProcessing}
          fullWidth
          sx={{ mb: 2 }}
        >
          {isProcessing ? "Processing..." : "Add Images"}
          <input
            type="file"
            name="images"
            hidden
            multiple
            accept="image/*,.heic"
            onChange={handleFileChange}
          />
        </Button>

        {previews.length > 0 && (
          <Stack direction="row" spacing={2} sx={{ overflowX: "auto", py: 1 }}>
            {/* CRITICAL CHANGE: Map over 'previews' instead of 'selectedFiles' 
        because 'previews' contains both old URLs and new local blobs.
    */}
            {previews.map((url, index) => (
              <Box key={url} sx={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={url}
                  alt="Preview"
                  style={{
                    width: 120,
                    height: 120,
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
            ))}
          </Stack>
        )}

        <Button type="submit" variant="contained" loading={submitting}>
          Submit Edit
        </Button>
      </Stack>
    </form>
  );
}
