"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Grid,
  Card,
  CircularProgress,
  CardContent,
  Button,
} from "@mui/material";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );

  // Mock counts for now
  const [stats, setStats] = useState({
    artists: 0,
    artworks: 0,
    exhibitions: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user || parsed);
    }

    // TODO: Replace with real fetches from Supabase
    setStats({ artists: 12, artworks: 45, exhibitions: 3 });
  }, []);

  if (!user) return <CircularProgress />;

  const capitalized = (str: string) =>
    `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

  const GridItem = ({name, count}: {name: string, count: number}) => {
    return (
      <Grid size={{
        xs: 12,
        sm: 4
      }}>
        <Card>
          <CardContent>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="h4">{count}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const GridButton = ({name}: {name: string}) => {
    return (
      <Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push(`/dashboard/${name}`)}
          >
            Manage {name}
          </Button>
        </Grid>
    )
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome, {capitalized(user.username)} ({user.role})
      </Typography>

      <Grid container spacing={3} style={{ marginBottom: "40px" }}>
        <GridItem name="Artists" count={stats.artists} />
        <GridItem name="Artworks" count={stats.artworks} />
        <GridItem name="Exhibitions" count={stats.exhibitions} />
      </Grid>

      <Grid container spacing={2}>
        <GridButton name="artists" />
        <GridButton name="artworks" />
        <GridButton name="exhibitions" />
      </Grid>
    </>
  );
}
