'use client';
import { useRouter } from 'next/navigation';
import { Container, Typography, Button } from '@mui/material';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container style={{ marginTop: '100px', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Art Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ marginRight: '16px' }}
        onClick={() => router.push('/login')}
      >
        Login
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => router.push('/dashboard')}
      >
        Dashboard (test)
      </Button>
    </Container>
  );
}
