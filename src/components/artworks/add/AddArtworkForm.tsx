"use client";

import { useState, useEffect } from "react";
import {
  Alert,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

interface Artist {
  id: string;
  name: string;
}

type Props = {
  onSuccess?: () => void;
};

export default function AddArtworkForm({ onSuccess }: Props) {
  const [artists, setArtists] = useState<Artist[]>([]);
  // const [artistId, setArtistId] = useState("");
  const [artwork, setArtwork] = useState({
    artist_id: "",
    title: "",
    year: "",
    material: "",
    dimensions: "",
    info: "",
    price: "",
    signed: false,
    error: "",
  });
  const [error, setError] = useState(false);
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

    const res = await fetch("/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artwork),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError(true);
      return;
    }

    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit}>
      <pre>{JSON.stringify(artwork, null, 2)}</pre>
      <Stack spacing={2}>
        {/* <TextField
          label="Creator"
          value={artwork.artist_id}
          required
          onChange={(e) => setArtwork({
            ...artwork,
            artist_id: e.target.value
          })}
        /> */}
        <Select
          // labelId="demo-simple-select-label"
          id="artist_id"
          value={artwork.artist_id}
          label="Artist"
          onChange={(e) => setArtwork({
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
          value={artwork.title}
          required
          onChange={(e) =>
            setArtwork({
              ...artwork,
              title: e.target.value,
            })
          }
        />
        <TextField
          label="Year"
          value={artwork.year}
          required
          onChange={(e) =>
            setArtwork({
              ...artwork,
              year: e.target.value,
            })
          }
        />
        <TextField
          label="Material"
          value={artwork.material}
          required
          onChange={(e) =>
            setArtwork({
              ...artwork,
              material: e.target.value,
            })
          }
        />
        <TextField
          label="Dimensions"
          value={artwork.dimensions}
          required
          onChange={(e) =>
            setArtwork({
              ...artwork,
              dimensions: e.target.value,
            })
          }
        />
        <TextField
          label="Info"
          value={artwork.info}
          multiline
          rows={3}
          onChange={(e) =>
            setArtwork({
              ...artwork,
              info: e.target.value,
            })
          }
        />
        <TextField
          label="Price"
          value={artwork.price}
          required
          onChange={(e) =>
            setArtwork({
              ...artwork,
              price: e.target.value,
            })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              value={artwork.signed}
              onChange={(e) =>
                setArtwork({
                  ...artwork,
                  signed: e.target.checked,
                })
              }
            />
          }
          label="Signed?"
        />
        <Button type="submit" variant="contained" loading={submitting}>
          Create Artwork
        </Button>
        {error && <Alert severity="error">There is something wrong.</Alert>}
      </Stack>
    </form>
  );
}
