import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { Artwork } from "@/app/(protected)/artworks/page";

interface DisplayArtwork extends Artwork {
  cover_url: string | null;
}

interface ArtworkCardProps {
  artwork: DisplayArtwork;
  includeArtistName?: boolean;
}

export default function ArtworkCard({ artwork, includeArtistName }: ArtworkCardProps) {
  return (
    <Card key={artwork.id} sx={{ width: 250, margin: 1 }}>
      <CardActionArea component={NextLink} href={`/artworks/${artwork.id}`}>
        <CardMedia
          component="img"
          image={artwork.cover_url!}
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
          {includeArtistName && (
            <Typography variant="body2">
              Artist: {artwork.artist_name}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Year: {artwork.year}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Material: {artwork.material}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <b>{artwork.signed ? "Signed" : "Unsigned"}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
