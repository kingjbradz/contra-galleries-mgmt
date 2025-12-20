import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

export default function Navbar({ title }: { title: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('user');
    router.push('/login');
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }} >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <IconButton aria-label="home" color="inherit" onClick={() => router.push('/')}>
          <HomeIcon />
        </IconButton>
          <Typography variant="h5">
            {title}
          </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
