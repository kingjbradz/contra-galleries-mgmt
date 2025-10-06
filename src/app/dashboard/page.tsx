'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, Typography } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsed =  JSON.parse(storedUser);
    setUser(parsed.user);
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <CircularProgress />;

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography>Welcome, {user?.username}</Typography>
      <Typography>Your role: {user?.role}</Typography>

      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </Button>
    </div>
  );
}
