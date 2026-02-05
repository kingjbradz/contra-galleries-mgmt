"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";
import {
  Card,
  CardContent,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import ModalButton from "@/components/ui/ModalButton";
import AddArtistForm from "@/components/artists/add/AddArtistForm";
import EditArtistForm from "@/components/artists/edit/EditArtistForm";
import Progress from "@/components/ui/Progress";

export interface Artist {
  id?: string;
  name: string;
  bio?: string;
  error?: string;
}

export default function ArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const { user, loading } = useAuth();
  const { setPageHeader } = usePageHeader();

  const loadArtists = useCallback(async () => {
    setLoadingArtists(true);
    const res = await fetch("/api/artists");
    const data = await res.json();
    setArtists(data.artists);
    setLoadingArtists(false);
  }, []);

  useEffect(() => {
    setPageHeader({ title: "Artists" });
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  if (loading || loadingArtists) return <Progress />;
  if (!user) return <Progress />; // fallback, AuthProvider handles redirect
  return (
    <Grid container spacing={3} padding={2}>
      <Grid size={{ xs: 12 }}>
        <ModalButton label="Add Artist" title="Add Artist">
          {(close) => (
            <AddArtistForm
              onSuccess={() => {
                close();
                loadArtists();
              }}
            />
          )}
        </ModalButton>
      </Grid>
      {artists ? (
        artists.map((artist) => (
          <Grid key={artist.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{artist.name}</Typography>
                <Button onClick={() => router.push(`/artists/${artist.id}`)}>
                  View Artist
                </Button>
                <ModalButton
                  label="Edit Artist"
                  title="Edit Artist"
                  variant="text"
                >
                  {(close) => (
                    <EditArtistForm
                      artist={artist}
                      onSuccess={() => {
                        close();
                        loadArtists();
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
          Could not load artists
        </Typography>
      )}
    </Grid>
  );
}
