'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { setUser} = useAuth()
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true)
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
      setSubmitting(false)
    } else {
      localStorage.setItem('user', JSON.stringify(data)); // simple session
      setUser(data.user);
      router.push('/dashboard');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '100px' }}>
      <form onSubmit={handleLogin}>
        <Typography variant="h5" align="center" gutterBottom>Contra Galleries Management</Typography>
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
          loading={submitting}
          type="submit"
        >
          Login
        </Button>
      </form>
    </Container>
  );
}
