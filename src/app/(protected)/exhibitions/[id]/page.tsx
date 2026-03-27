import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import { Exhibition } from "../page";
import { getExhibition, getExhibitionArtworks, deleteExhibitionAction } from "@/lib/exhibitionActions";
import EditExhibitionForm from "@/components/exhibitions/edit/EditExhibitionForm";
import IndividualPageActionRow from "@/components/ui/IndividualPageActionRow";
import NotFoundComponent from "@/components/ui/NotFoundComponent";
import ArtworkCard from "@/components/ui/ArtworkCard";

export default async function ExhibitionPage({
  params,
}: {
  params: Promise<Exhibition>;
}) {
  const { id } = await params;
  const exhibition: Exhibition = await getExhibition(id!);
  const artworks = await getExhibitionArtworks(id!);

  if (!exhibition) {
    return <NotFoundComponent type="exhibition" back="/exhibitions" />;
  }

  return (
    <Grid container spacing={3} padding={2}>
      {exhibition.error ? (
        <Typography variant="h4" width="100%" textAlign="center">
          {exhibition.error}
        </Typography>
      ) : (
        <>
          <PageHeaderSetter title={exhibition.name} />
          <IndividualPageActionRow
            itemName={exhibition.name}
            deleteType="exhibition"
            deleteAction={deleteExhibitionAction.bind(null, exhibition.id!)}
            redirectPath="/exhibitions"
            editForm={<EditExhibitionForm exhibition={exhibition} artworks={artworks} />}
          />
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            {exhibition?.cover_image ? (
              <img
                src={exhibition?.cover_image}
                style={{
                  height: 300,
                  width: 300,
                }}
              ></img>
            ) : (
              <Typography>No Cover Image</Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>
              {exhibition.public
                ? "Live on public site."
                : "Not live on public site."}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>
              {exhibition.private
                ? "Live on private site."
                : "Not live on private site."}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>
              {exhibition.onsite
                ? "Live on QR/On-site site."
                : "Not live on QR/On-site site."}
            </Typography>
          </Grid>
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
                <Typography component="span">Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{exhibition.description}</Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography>
             Featured Artworks:
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
          {artworks.map((artwork) => 
              <ArtworkCard key={artwork} artwork={artwork} includeArtistName />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
}
