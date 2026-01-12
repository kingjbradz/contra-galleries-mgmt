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
import { usePageHeader } from "@/context/page-header/PageHeaderContext";

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

  const GridTitle = ({ title }: { title: string }) => (
    <Typography variant="h6"  width="100%">
      {title}
    </Typography>)

  const GridCard = ({
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
        onClick={() => router.push(`/${name}`)}
      >
        Manage {name}
      </Button>
    </Grid>
  );

  const GridLink = ({ name, href }: { name: string, href: string }) => (
    <Grid>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => window.open(href, "_blank")}
      >
        {name}
      </Button>
    </Grid>
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Logged In As: {capitalized(user.username)} ({user.role})
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <GridTitle title="Stats" />
        <GridCard name="Artists" count={stats.artists} />
        <GridCard name="Artworks" count={stats.artworks} />
        <GridCard name="Exhibitions" count={stats.exhibitions} />
      </Grid>

      <Grid container spacing={2}>
        <GridTitle title="Manage" />
        <GridButton name="artists" />
        <GridButton name="artworks" />
        <GridButton name="exhibitions" />
      </Grid>

      <Grid container spacing={2} marginTop={1}>
        <GridTitle title="Quick Links" />
        <GridLink name="Main Website" href="https://contragalleries.com" />
        <GridLink name="Private Website" href="https://private.contragalleries.com" />
        <GridLink name="QR/Onsite" href="https://onsite.contragalleries.com" />
      </Grid>
    </>
  );
}