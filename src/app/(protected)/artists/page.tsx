"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/PageHeaderContext";
import { Card, CardContent, CircularProgress, Button, Grid, Typography } from "@mui/material";
import AddArtistButton from "@/components/ui/AddArtistButton";

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

  useEffect(() => {
    setPageHeader({ title: "Artists" });

    async function loadArtists() {
      try {
        const res = await fetch("/api/artists");
        if (!res.ok) throw new Error("Failed to fetch artists");
  
        const data = await res.json();
        setArtists(data.artists);
      } catch (err) {
        console.error("Failed to load artists", err);
      } finally {
        setLoadingArtists(false);
      }
    }

    loadArtists()
  }, []);

  if (loading || loadingArtists) return <CircularProgress />;
  if (!user) return <CircularProgress />; // fallback, AuthProvider handles redirect
  return (
      <Grid container spacing={3} padding={2}>
        <AddArtistButton />
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
                <Button onClick={() => router.push(`/artist/${artist.id}`)}>View Artist</Button>
                <Button onClick={() => router.push(`/artist/${artist.id}`)}>Edit Artist</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>   
  );
}