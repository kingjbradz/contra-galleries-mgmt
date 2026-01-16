"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";
import {
  Card,
  CardContent,
  CircularProgress,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import ModalButton from "@/components/ui/ModalButton";
import AddArtworkForm from "@/components/artworks/add/AddArtworkForm";
import EditArtworkForm from "@/components/artworks/edit/EditArtworkForm";

export interface Artwork {
  id?: string;
  title: string;
  info?: string;
  year?: string;
  price?: string;
  signed?: boolean;
  material?: string;
  dimensions?: string;
  artist_id?: string;
  error?: string;
}

export default function ArtistsPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const { user, loading } = useAuth();
  const { setPageHeader } = usePageHeader();

  const loadArtworks = useCallback(async () => {
    setLoadingArtworks(true);
    const res = await fetch("/api/artworks");
    const data = await res.json();
    setArtworks(data.artworks);
    setLoadingArtworks(false);
  }, []);

  useEffect(() => {
    setPageHeader({ title: "Artworks" });
  }, []);

  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  if (loading || loadingArtworks) return <CircularProgress />;
  if (!user) return <CircularProgress />; // fallback, AuthProvider handles redirect
  return (
    <Grid container spacing={3} padding={2}>
      <Grid size={{ xs: 12 }}>
        <ModalButton label="Add Artwork" title="Add Artwork">
          {(close) => (
            <AddArtworkForm
              onSuccess={() => {
                close();
                loadArtworks();
              }}
            />
          )}
        </ModalButton>
      </Grid>
      {artworks ? (
        artworks.map((artwork) => (
          <Grid key={artwork.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{artwork.title}</Typography>
                <Button onClick={() => router.push(`/artworks/${artwork.id}`)}>
                  View Artwork
                </Button>
                {/* <EditArtistButton artist={artist} onArtistEdited={loadArtworks}/> */}
                <ModalButton
                  label="Edit Artwork"
                  title="Edit Artwork"
                  variant="text"
                >
                  {(close) => (
                    <EditArtworkForm
                      artwork={artwork}
                      onSuccess={() => {
                        close();
                        loadArtworks();
                      }}
                    />
                  )}
                </ModalButton>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h4" width="100%" textAlign="center">
          Could not load artworks
        </Typography>
      )}
    </Grid>
  );
}
