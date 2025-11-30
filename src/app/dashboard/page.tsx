'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Grid, Card, CircularProgress, CardContent, Button } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  // Mock counts for now
  const [stats, setStats] = useState({ artists: 0, artworks: 0, exhibitions: 0 });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user || parsed);
    }

    // TODO: Replace with real fetches from Supabase
    setStats({ artists: 12, artworks: 45, exhibitions: 3 });
  }, []);

  if (!user) return <CircularProgress />;

  const capitalized = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;   

  const GridSizings = {
    xs: 12,
    sm: 4
  }
  

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome, {capitalized(user.username)} ({user.role})
      </Typography>

      <Grid container spacing={3} style={{ marginBottom: '40px' }}>
        <Grid size={GridSizings}>
          <Card>
            <CardContent>
              <Typography variant="h6">Artists</Typography>
              <Typography variant="h4">{stats.artists}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={GridSizings}>
          <Card>
            <CardContent>
              <Typography variant="h6">Artworks</Typography>
              <Typography variant="h4">{stats.artworks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={GridSizings}>
          <Card>
            <CardContent>
              <Typography variant="h6">Exhibitions</Typography>
              <Typography variant="h4">{stats.exhibitions}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid>
          <Button variant="contained" color="primary" onClick={() => router.push('/dashboard/artists')}>
            Manage Artists
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" color="primary" onClick={() => router.push('/dashboard/artworks')}>
            Manage Artworks
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" color="primary" onClick={() => router.push('/dashboard/exhibitions')}>
            Manage Exhibitions
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
