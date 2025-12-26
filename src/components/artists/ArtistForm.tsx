"use client";

import { useState } from "react";
import { Alert, TextField, Button, Stack } from "@mui/material";

type Props = {
  onSuccess?: () => void;
};

export default function ArtistForm({ onSuccess }: Props) {
  const [artist, setArtist] = useState({
    name: "",
    bio: ""
  })
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
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
        <TextField
          label="Name"
          value={artist.name}
          required
          onChange={(e) => setArtist({
            ...artist,
            name: e.target.value
          })}
        />

        <TextField
          label="Bio"
          value={artist.bio}
          multiline
          rows={3}
          onChange={(e) => setArtist({
            ...artist,
            bio: e.target.value
          })}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
        >
          Create Artist
        </Button>
        {error && <Alert severity="error">There is something wrong.</Alert>}
      </Stack>
    </form>
  );
}
