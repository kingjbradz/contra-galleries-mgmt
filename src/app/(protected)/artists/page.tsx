import { Grid } from "@mui/material";
import AddArtistForm from "@/components/artists/add/AddArtistForm";
import ListPageActionRow from "@/components/ui/ListPageActionRow";
import ArtistsTable from "@/components/artists/ArtistsTable";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";

export interface Artist {
  id?: string;
  name: string;
  notes?: string;
  error?: string;
}

export default async function ArtistsPage() {
  return (
    <Grid container spacing={3} padding={2}>
      <PageHeaderSetter title="Artists" />
      <ListPageActionRow
        label="Add Artist"
        title="Add Artist"
        form={<AddArtistForm />}
      />
        <ArtistsTable />
    </Grid>
  );
}
