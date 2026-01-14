import { Artwork } from "../page";
import { Accordion, AccordionSummary, AccordionDetails, CircularProgress, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";

export default async function ArtworkPage({
  params,
}: {
  params: Promise<Artwork>;
}) {
  const { id } = await params;

  // Fetch data directly on the server
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${id}`,
    {
      cache: "no-store", // ensures fresh data
    }
  );

  const artwork: Artwork = await res.json();
  
  return (
    <Grid container spacing={3} padding={2}>
      {artwork.error ? (
        <Typography variant="h4" width="100%" textAlign="center">
          {artwork.error}
        </Typography>
      ) : (
        <>
            <PageHeaderSetter title={artwork.title} />
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>{artwork.info}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>{artwork.year}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>{artwork.price}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>{artwork.signed ? "signed" : "not signed"}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>{artwork.material}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>{artwork.dimensions}</Typography>
          </Grid>

        </>
      )}
    </Grid>
  );
}