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
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { deleteArtistAction } from "@/lib/artistActions";

export interface Artist {
  id?: string;
  name: string;
  notes?: string;
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
                  View
                </Button>
                <ModalButton
                  label="Edit"
                  title={`Edit ${artist.name}`}
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
                <ModalButton
                  label="Delete"
                  title={`Delete ${artist.name}`}
                  variant="text"
                >
                  {(close) => (
                    <DeleteConfirmation
                      type="artist"
                      action={() => deleteArtistAction(artist.id!)}
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
