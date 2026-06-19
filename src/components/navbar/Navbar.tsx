import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import Title from "./Title";

export default function Navbar({ title }: { title: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false)

  const handleLogout = async () => {
    setSubmitting(true)
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }} >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <IconButton aria-label="home" color="inherit" onClick={() => router.push('/dashboard')}>
          <HomeIcon />
        </IconButton>
        <Title title={title} />
        <Button color="inherit" onClick={handleLogout} loading={submitting}>
          {submitting ? <CircularProgress sx={{ color: 'white' }} /> : "Logout"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
