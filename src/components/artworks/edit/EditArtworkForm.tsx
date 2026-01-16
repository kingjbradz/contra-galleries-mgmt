"use client";

import { useState, useEffect } from "react";
import { Alert, Checkbox, Select, MenuItem, FormControlLabel, TextField, Button, Stack } from "@mui/material";
import { Artwork } from "@/app/(protected)/artworks/page";
import { Artist } from "../add/AddArtworkForm";
import { supabase } from "@/lib/supabaseClient";


type Props = {
  artwork: Artwork;
  onSuccess?: () => void;
};

export default function EditArtworkForm({ artwork, onSuccess }: Props) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [editedArtwork, setEditedArtwork] = useState<Artwork>({
    artist_id: artwork.artist_id,
    title: artwork.title,
    year: artwork.year,
    material: artwork.material,
    dimensions: artwork.dimensions,
    info: artwork.info,
    price: artwork.price,
    signed: artwork.signed,
  });
  const [error, setError] = useState(false)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    console.log()

    const res = await fetch(`/api/artworks/${artwork.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedArtwork),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError(true)
      return;
    }

    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Select
          value={editedArtwork.artist_id || ""}
          label="Artist"
          onChange={(e) => setEditedArtwork({
            ...artwork,
            artist_id: e.target.value
          })}
        >
          {artists.map((artist) => (
      
          <MenuItem key={artist.id} value={artist.id}>{artist.name}</MenuItem>
        ))}
        </Select>
        <TextField
          label="Title"
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
          label="Info"
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
        <Button type="submit" variant="contained" loading={submitting}>
          Edit Artwork
        </Button>
        {error && <Alert severity="error">There is something wrong.</Alert>}
      </Stack>
    </form>
  );
}
