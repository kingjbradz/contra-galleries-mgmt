import { Button, Grid, Typography } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from '@mui/icons-material/Home';


interface NotFoundProps {
  type?: string;
  back?: string;
}

export default function NotFoundComponent({ type, back }: NotFoundProps) {
  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: " calc(100vh - 64px)",
      }}
    >
      <Grid>
        <Typography sx={{ textTransform: "capitalize" }}>
          {type ? `${type} not found.` : "Page not found"}
        </Typography>
      </Grid>
      <br />
      <Grid>
        <Button variant="contained" startIcon={back ? <ArrowBackIcon /> : <HomeIcon />}>
          {back ? (
            <Link href={back}>Back</Link>
          ) : (
            <Link href="/dashboard">Homepage.</Link>
          )}
        </Button>
      </Grid>
    </Grid>
  );
}
