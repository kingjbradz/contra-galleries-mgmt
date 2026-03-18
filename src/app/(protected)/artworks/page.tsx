import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddArtworkForm from "@/components/artworks/add/AddArtworkForm";
import { getArtworks, deleteArtworkAction } from "@/lib/artworkActions";
import ActionButtons from "@/components/ui/ActionButtons";
import ListPageActionRow from "@/components/ui/ListPageActionRow";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";

export interface ArtworkImage {
  id?: string; // Optional if you don't need the ID on the client
  artwork_id: string;
  url: string;
  is_cover: boolean;
  created_at?: string;
}

export interface Artwork {
  id?: string;
  title: string;
  info?: string;
  year?: string;
  price?: string;
  signed?: boolean;
  material?: string;
  dimensions?: string;
  artist_id?: string;
  error?: string;
  artwork_images?: ArtworkImage[];
  artist_name?: string;
}

export default async function ArtworksPage() {
  const artworks = await getArtworks();
  return (
    <Grid container spacing={3} padding={2}>
      <PageHeaderSetter title="Artworks" />
      <ListPageActionRow
        label="Add Artwork"
        title="Add Artwork"
        form={<AddArtworkForm />}
      />
      {artworks ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="center">Artist</TableCell>
                <TableCell align="center">Year</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Material</TableCell>
                <TableCell align="center">Signed?</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artworks.map((artwork) => (
                <TableRow
                  key={artwork.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {artwork.title}
                  </TableCell>
                  <TableCell align="center">{artwork.artist_name}</TableCell>
                  <TableCell align="center">{artwork.year}</TableCell>
                  <TableCell align="center">{artwork.price}</TableCell>
                  <TableCell align="center">{artwork.material}</TableCell>
                  <TableCell align="center">
                    {artwork.signed ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="right">
                    <ActionButtons
                      itemName={artwork.title}
                      deleteType="artwork"
                      deleteAction={deleteArtworkAction.bind(null, artwork.id!)}
                      viewPath={`/artworks/${artwork.id}`}
                      // no editForm as users should do so on an individual page as there's too many fields, images etc
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h4" width="100%" textAlign="center">
          Could not load artworks
        </Typography>
      )}
    </Grid>
  );
}
