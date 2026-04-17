import { Artwork } from "../page";
import { Grid, Typography } from "@mui/material";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import { deleteArtworkAction, getArtwork } from "@/lib/artworkActions";
import EditArtworkForm from "@/components/artworks/edit/EditArtworkForm";
import Link from "next/link";
import IndividualPageActionRow from "@/components/ui/IndividualPageActionRow";
import NotFoundComponent from "@/components/ui/NotFoundComponent";

const italicStyles = {
  fontStyle: "italic"
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<Artwork>;
}) {
  const { id } = await params;
  const artwork: Artwork = await getArtwork(id!);

  if (!artwork) {
    return <NotFoundComponent type="artwork" back="/artworks" />
  }

  return (
    <Grid container spacing={3} padding={2}>
      {artwork.error ? (
        <Typography variant="h4" width="100%" textAlign="center">
          {artwork.error}
        </Typography>
      ) : (
        <>
          <PageHeaderSetter title={artwork.title} />
          <IndividualPageActionRow
          itemName={artwork?.title}
          deleteType="artwork"
          deleteAction={deleteArtworkAction.bind(null, artwork.id!)}
          redirectPath="/artworks"
          editForm={
            <EditArtworkForm
              artwork={artwork}
            />
          }
          />
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography sx={italicStyles}>Artist</Typography>
            <Link href={`/artists/${artwork.artist_id}`}><Typography variant="h5" color="info">{artwork.artist_name}</Typography></Link>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography sx={italicStyles}>Year</Typography>
            <Typography>{artwork.year}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography sx={italicStyles}>Price</Typography>
            <Typography>${artwork.price}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography sx={italicStyles}>Material</Typography>
            <Typography>{artwork.material}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography sx={italicStyles}>Dimensions</Typography>
            <Typography>{artwork.dimensions}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography sx={italicStyles}>Artwork Information/Bio:</Typography>
            <Typography>{artwork.info}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography><b>
              {artwork.signed ? "Artwork is signed" : "Artwork is not signed"}
            </b></Typography>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
            <Typography sx={italicStyles}>Image Gallery</Typography>
          </Grid>
          <Grid
            size={{ xs: 12 }}
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            {artwork.artwork_images?.map((image) => {
              return (
                <img
                  key={image.id}
                  src={image.url}
                  style={{
                    height: 300,
                    width: 300,
                    border: image.is_cover === true ? "3px solid green" : "",
                  }}
                ></img>
              );
            })}
          </Grid>
        </>
      )}
    </Grid>
  );
}
