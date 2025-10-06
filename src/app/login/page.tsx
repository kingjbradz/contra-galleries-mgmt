'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
    } else {
      localStorage.setItem('user', JSON.stringify(data)); // simple session
      router.push('/dashboard');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '100px' }}>
      <Typography variant="h5" align="center" gutterBottom>Dashboard Login</Typography>
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: '16px' }}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  );
}
