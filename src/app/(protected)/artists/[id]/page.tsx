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

export default async function ArtistPage({
  params,
}: {
  params: Promise<Artist>;
}) {
  const { id } = await params;
  const artist: Artist = await getArtist(id!);
  const artworks = await getArtworksByArtist(id!);

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
            {artworks.map((artwork) => (
              <Card key={artwork.id} sx={{ maxWidth: 345 }}>
                <CardActionArea
                  component={NextLink}
                  href={`/artworks/${artwork.id}`}
                >
                  <CardMedia
                    component="img"
                    image={artwork.cover_url}
                    alt="cover image"
                    sx={{
                      height: 200, // Fixed height in pixels
                      objectFit: "cover", // Fills the area, cropping edges if necessary
                      width: "100%",
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {artwork.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Year: {artwork.year}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Material: {artwork.material}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      <b>{artwork.signed ? "Signed" : "Unsigned"}</b>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Grid>
        </>
      )}
    </Grid>
  );
}
