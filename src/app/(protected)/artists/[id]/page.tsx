import { Artist } from "../page";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import { getArtist } from "@/lib/artistActions";
import EditArtistForm from "@/components/artists/edit/EditArtistForm";
import { deleteArtistAction } from "@/lib/artistActions";
import { getArtworksByArtist } from "@/lib/artworkActions";
import NextLink from "next/link";
import IndividualPageActionRow from "@/components/ui/IndividualPageActionRow";
import NotFoundComponent from "@/components/ui/NotFoundComponent";
import ArtworkCard from "@/components/ui/ArtworkCard";

export default async function ArtistPage({
  params,
}: {
  params: Promise<Artist>;
}) {
  const { id } = await params;
  const artist: Artist = await getArtist(id!);
  const artworks = await getArtworksByArtist(id!);

  if (!artist) {
    return <NotFoundComponent type="artist" back="/artists" />
  }

  return (
    <Grid container spacing={3} padding={2}>
      {artist.error ? (
        <Typography variant="h4" width="100%" textAlign="center">
          {artist.error}
        </Typography>
      ) : (
        <>
          <PageHeaderSetter title={artist.name} />
          <IndividualPageActionRow
            itemName={artist.name}
            deleteType="artist"
            deleteAction={deleteArtistAction.bind(null, artist.id!)}
            redirectPath="/artists"
            editForm={<EditArtistForm artist={artist} />}
          />
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Accordion sx={{ width: "500px" }}>
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
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            {artworks.map((artwork) => 
              <ArtworkCard key={artwork} artwork={artwork} />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
}
