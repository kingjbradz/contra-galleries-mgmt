"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Typography,
  Grid,
  Card,
  CircularProgress,
  CardContent,
  Button,
} from "@mui/material";
import { usePageHeader } from "@/context/PageHeaderContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { setPageHeader } = usePageHeader();

  const [stats, setStats] = useState({
    artists: 0,
    artworks: 0,
    exhibitions: 0,
  });

  useEffect(() => {
    async function loadStats() {
      // TODO — replace these with real DB/API calls soon
      setStats({
        artists: 12,
        artworks: 45,
        exhibitions: 3,
      });
    }

    loadStats();
    setPageHeader({ title: "Dashboard" });
  }, []);

  if (loading) return <CircularProgress />;
  if (!user) return <CircularProgress />; // fallback, AuthProvider handles redirect

  const capitalized = (str: string) =>
    `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

  const GridItem = ({
    name,
    count,
  }: {
    name: string;
    count: number;
  }) => (
    <Grid
    size={{
      xs: 12,
      sm: 4
    }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="h4">{count}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const GridButton = ({ name }: { name: string }) => (
    <Grid>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => router.push(`/dashboard/${name}`)}
      >
        Manage {name}
      </Button>
    </Grid>
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome, {capitalized(user.username)} ({user.role})
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
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