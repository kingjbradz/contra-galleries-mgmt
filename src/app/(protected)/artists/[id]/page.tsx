"use client";

import { useParams } from "next/navigation";
import { Typography } from "@mui/material";

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Artist {id}
      </Typography>

      {/* Artist details will go here */}
    </>
  );
}
