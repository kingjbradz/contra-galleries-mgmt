"use client";

import { useState } from "react";
import { Alert, TextField, Button, Stack } from "@mui/material";
import { createArtistAction } from "@/lib/artistActions";

type Props = {
  onSuccess?: () => void;
};

export default function AddArtistForm({ onSuccess }: Props) {
  const [artist, setArtist] = useState({
    name: "",
    notes: "",
  });
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const result = await createArtistAction(artist);

    setSubmitting(false);

    if (result.error) {
      setError(true);
      console.error(result.error);
      return;
    }

    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Name"
          value={artist.name}
          required
          onChange={(e) =>
            setArtist({
              ...artist,
              name: e.target.value,
            })
          }
        />

        <TextField
          label="Info"
          value={artist.notes}
          multiline
          rows={3}
          onChange={(e) =>
            setArtist({
              ...artist,
              notes: e.target.value,
            })
          }
          helperText="Add any notes here - this is not public."
        />

        <Button type="submit" variant="contained" loading={submitting}>
          Create Artist
        </Button>
        {error && <Alert severity="error">There is something wrong.</Alert>}
      </Stack>
    </form>
  );
}
