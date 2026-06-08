import { Grid } from "@mui/material";
import ListPageActionRow from "@/components/ui/ListPageActionRow";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import AddExhibitionForm from "@/components/exhibitions/add/AddExhibitionForm";
import ExhibitionsTable from "@/components/exhibitions/ExhibitionsTable";

interface ExhibitionArtwork {
  exhibition_id: string;
  artwork_id: string;
}

export interface Exhibition {
  id: string;
  name: string;
  cover_image?: string;
  description?: string;
  onsite?: boolean;
  public?: boolean;
  private?: boolean;
  slug?: string;
  artworks?: ExhibitionArtwork[];
  error?: string;
}

export default async function ExhibitionsPage() {
  return (
    <Grid container spacing={3} padding={2}>
      <PageHeaderSetter title="Exhibitions" />
      <ListPageActionRow
        label="Add Exhibition"
        title="Add Exhibition"
        form={<AddExhibitionForm />}
      />
      <ExhibitionsTable />
    </Grid>
  );
}
