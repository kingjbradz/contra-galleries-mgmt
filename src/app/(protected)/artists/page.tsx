"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/PageHeaderContext";
import { Card, CardContent, CircularProgress, Button, Grid, Typography } from "@mui/material";
import AddArtistButton from "@/components/artists/add/AddArtistButton";

interface Artists {
  id: string;
  name: string;
}

export default function ArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artists[]>([])
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

  if (loading || loadingArtists) return <CircularProgress />;
  if (!user) return <CircularProgress />; // fallback, AuthProvider handles redirect
  return (
      <Grid container spacing={3} padding={2}>
        <Grid size={{ xs: 12 }}>

          <AddArtistButton onArtistCreated={loadArtists}/>
        </Grid>
        {artists.map((artist) => (
          <Grid
            key={artist.id}
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {artist.name}
                </Typography>
                <Button onClick={() => router.push(`/artists/${artist.id}`)}>View Artist</Button>
                <Button onClick={() => router.push(`/artists/${artist.id}`)}>Edit Artist</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>   
  );
}