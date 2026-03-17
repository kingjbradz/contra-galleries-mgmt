import { Card, CardContent, Grid, Typography } from "@mui/material";
import AddArtistForm from "@/components/artists/add/AddArtistForm";
import EditArtistForm from "@/components/artists/edit/EditArtistForm";
import { getArtists, deleteArtistAction } from "@/lib/artistActions";
import ActionButtons from "@/components/ui/ActionButtons";
import ListPageActionRow from "@/components/ui/ListPageActionRow";

export interface Artist {
  id?: string;
  name: string;
  notes?: string;
  error?: string;
}

export default async function ArtistsPage() {
  const artists = await getArtists()
  return (
    <Grid container spacing={3} padding={2}>
      <ListPageActionRow
        label="Add Artist"
        title="Add Artist"
        form={<AddArtistForm />}
      />
      {artists ? (
        artists.map((artist) => (
          <Grid key={artist.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{artist.name}</Typography>
                <ActionButtons
                  itemName={artist.name}
                  deleteType="artist"
                  deleteAction={deleteArtistAction.bind(null, artist.id!)}
                  editForm={<EditArtistForm artist={artist} />}
                  viewPath={`/artists/${artist.id}`}
                />
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h4" width="100%" textAlign="center">
          Could not load artists
        </Typography>
      )}
    </Grid>
  );
}
