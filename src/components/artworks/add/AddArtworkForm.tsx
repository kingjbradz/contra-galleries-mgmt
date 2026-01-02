"use client";

import { useState } from "react";
import { Alert, TextField, Button, Stack } from "@mui/material";

type Props = {
  onSuccess?: () => void;
};

export default function AddArtworkForm({ onSuccess }: Props) {
  const [artwork, setArtwork] = useState({
    name: "",
    bio: ""
  })
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false);

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
          value={artwork.name}
          required
          onChange={(e) => setArtwork({
            ...artwork,
            name: e.target.value
          })}
        />

        <TextField
          label="Bio"
          value={artwork.bio}
          multiline
          rows={3}
          onChange={(e) => setArtwork({
            ...artwork,
            bio: e.target.value
          })}
        />

        <Button
          type="submit"
          variant="contained"
          loading={submitting}
        >
          Create Artwork
        </Button>
        {error && <Alert severity="error">There is something wrong.</Alert>}
      </Stack>
    </form>
  );
}
