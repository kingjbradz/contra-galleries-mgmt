import {
  Grid,
  Typography,
} from "@mui/material";
import AddArtworkForm from "@/components/artworks/add/AddArtworkForm";
import ListPageActionRow from "@/components/ui/ListPageActionRow";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import ArtworksTable from "@/components/artworks/ArtworksTable";

export interface ArtworkImage {
  id?: string; // Optional if you don't need the ID on the client
  artwork_id: string;
  url: string;
  is_cover: boolean;
  created_at?: string;
}

export interface Artwork {
  id?: string;
  title?: string;
  info?: string;
  year?: string;
  price?: string;
  signed?: boolean;
  material?: string;
  dimensions?: string;
  artist_id?: string;
  error?: string;
  slug?: string;
  artwork_images?: ArtworkImage[];
  artist_name?: string;
}

export default async function ArtworksPage() {
  return (
    <Grid container spacing={3} padding={2}>
      <PageHeaderSetter title="Artworks" />
      <ListPageActionRow
        label="Add Artwork"
        title="Add Artwork"
        form={<AddArtworkForm />}
      />
        <ArtworksTable />
    </Grid>
  );
}
