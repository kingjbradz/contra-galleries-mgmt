import { Artwork } from "../page";
import { Grid, Typography } from "@mui/material";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import { getArtwork } from  "@/lib/artworkActions";

export default async function ArtworkPage({
  params,
}: {
  params: Promise<Artwork>;
}) {
  const { id } = await params;
  const artwork: Artwork = await getArtwork(id!)
  
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