"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";
import { Card, CardContent, Button, Grid, Typography } from "@mui/material";
import ModalButton from "@/components/ui/ModalButton";
import AddArtworkForm from "@/components/artworks/add/AddArtworkForm";
import EditArtworkForm from "@/components/artworks/edit/EditArtworkForm";
import Progress from "@/components/ui/Progress";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { deleteArtworkAction } from "@/lib/artworkActions";

export interface ArtworkImage {
  id?: string; // Optional if you don't need the ID on the client
  artwork_id: string;
  url: string;
  is_cover: boolean;
  created_at?: string;
}

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
  artwork_images?: ArtworkImage[];
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

  if (loading || loadingArtworks) return <Progress />;
  if (!user) return <Progress />; // fallback, AuthProvider handles redirect
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
                  View
                </Button>
                {/* <EditArtistButton artist={artist} onArtistEdited={loadArtworks}/> */}
                <ModalButton label="Edit" title="Edit Artwork" variant="text">
                  {(close) => (
                    <EditArtworkForm
                      artwork={artwork}
                      initialImages={artwork.artwork_images || []}
                      onSuccess={() => {
                        close();
                        loadArtworks();
                      }}
                    />
                  )}
                </ModalButton>
                <ModalButton
                  label="Delete"
                  title="Delete Artwork"
                  variant="text"
                >
                  {(close) => (
                    <DeleteConfirmation
                      type="artwork"
                      // Pass the function definition
                      action={() => deleteArtworkAction(artwork.id!)}
                      onSuccess={() => {
                        close();
                        loadArtworks(); // Refresh the list
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
