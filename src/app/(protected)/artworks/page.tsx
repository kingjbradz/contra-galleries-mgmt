"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import AddArtworkForm from "@/components/artworks/add/AddArtworkForm";
import EditArtworkForm from "@/components/artworks/edit/EditArtworkForm";
import Progress from "@/components/ui/Progress";
import { getArtworks, deleteArtworkAction } from "@/lib/artworkActions";
import ActionButtons from "@/components/ui/ActionButtons";
import ListPageActionRow from "@/components/ui/ListPageActionRow";

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

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const { user, loading } = useAuth();
  const { setPageHeader } = usePageHeader();

  const loadArtworks = useCallback(async () => {
    setLoadingArtworks(true);
    const data = await getArtworks();
    setArtworks(data);
    setLoadingArtworks(false);
  }, []);

  useEffect(() => {
    setPageHeader({ title: "Artworks" });
  }, []);

  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  if (loading || loadingArtworks) return <Progress />;
  if (!user) return <Progress />; // fallback, AuthProvider handles redirect
  return (
    <Grid container spacing={3} padding={2}>
      <ListPageActionRow
        label="Add Artwork"
        title="Add Artwork"
        form={<AddArtworkForm />}
        handler={loadArtworks}
      />
      {artworks ? (
        artworks.map((artwork) => (
          <Grid key={artwork.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{artwork.title}</Typography>
                <ActionButtons
                  itemName={artwork.title}
                  deleteType="artwork"
                  deleteAction={deleteArtworkAction.bind(null, artwork.id!)}
                  editForm={<EditArtworkForm artwork={artwork} />}
                  viewPath={`/artworks/${artwork.id}`}
                  showViewButton
                  editLoadFunction={loadArtworks}
                />
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="h4" width="100%" textAlign="center">
          Could not load artworks
        </Typography>
      )}
    </Grid>
  );
}
