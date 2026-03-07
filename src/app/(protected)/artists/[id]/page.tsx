import { Artist } from "../page";
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import { getArtist } from "@/lib/artistActions";

export default async function ArtistPage({
  params,
}: {
  params: Promise<Artist>;
}) {
  const { id } = await params;
  const artist: Artist = await getArtist(id!)
  
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
          <Typography component="span">Notes</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>{artist.notes}</Typography>

        </AccordionDetails>
      </Accordion>
          </Grid>
        </>
      )}
    </Grid>
  );
}
