"use client";

import { useState } from "react";
import { Alert, TextField, Button, Stack } from "@mui/material";
import { Artist } from "@/app/(protected)/artists/page";
import { updateArtistAction } from "@/lib/artistActions";

type Props = {
  artist: Artist;
  onSuccess?: () => void;
};

export default function EditArtistForm({ artist, onSuccess }: Props) {
  const [editedArtist, setEditedArtist] = useState<Artist>({
    name: artist.name,
    notes: artist.notes,
  });
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const result = await updateArtistAction(artist.id!, editedArtist);

    setSubmitting(false);

    if (result.error) {
      setError(true);
      return;
    }

    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={editedArtist.name || ""}
          required
          onChange={(e) =>
            setEditedArtist({
              ...editedArtist,
              name: e.target.value,
            })
          }
        />

        <TextField
          label="Info"
          value={editedArtist.notes || ""}
          multiline
          rows={3}
          onChange={(e) =>
            setEditedArtist({
              ...editedArtist,
              notes: e.target.value,
            })
          }
          helperText="Add any notes here - this is not public."
        />

        <Button type="submit" variant="contained" loading={submitting}>
          Submit Edit
        </Button>
        {error && <Alert severity="error">There is something wrong.</Alert>}
      </Stack>
    </form>
  );
}
