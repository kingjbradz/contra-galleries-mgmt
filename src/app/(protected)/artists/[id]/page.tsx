import { Artist } from "../page";
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";

export default async function ArtistPage({
  params,
}: {
  params: Promise<Artist>;
}) {
  const { id } = await params;

  // Fetch data directly on the server
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artists/${id}`,
    {
      cache: "no-store", // ensures fresh data
    }
  );

  const artist: Artist = await res.json();
  
  return (
    <Grid container spacing={3} padding={2}>
      {artist.error ? (
        <Typography variant="h4" width="100%" textAlign="center">
          {artist.error}
        </Typography>
      ) : (
        <>
            <PageHeaderSetter title={artist.name} />
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
          <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Bio</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>{artist.bio}</Typography>

        </AccordionDetails>
      </Accordion>
          </Grid>
        </>
      )}
    </Grid>
  );
}
