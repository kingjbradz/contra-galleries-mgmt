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
import { getExhibitions, deleteExhibitionAction } from "@/lib/exhibitionActions";
import ActionButtons from "@/components/ui/ActionButtons";
import ListPageActionRow from "@/components/ui/ListPageActionRow";
import { PageHeaderSetter } from "@/context/page-header/PageHeaderSetter";
import AddExhibitionForm from "@/components/exhibitions/add/AddExhibitionForm";

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
  artworks?: ExhibitionArtwork[]
  error?: string;
}

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions()

  return (
    <Grid container spacing={3} padding={2}>
    <PageHeaderSetter title="Exhibitions" />
    <ListPageActionRow
      label="Add Exhibition"
      title="Add Exhibition"
      form={<AddExhibitionForm />}
    />
    {exhibitions ? (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Exhibition Name</TableCell>
              <TableCell align="center">Public</TableCell>
              <TableCell align="center">Private</TableCell>
              <TableCell align="center">Onsite</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exhibitions.map((exhibition) => (
              <TableRow
                key={exhibition.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {exhibition.name}
                </TableCell>
                <TableCell align="center">{exhibition.public ? "Yes" : "No"}</TableCell>
                <TableCell align="center">{exhibition.private ? "Yes" : "No"}</TableCell>
                <TableCell align="center">{exhibition.onsite ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <ActionButtons
                    itemName={exhibition.name}
                    deleteType="exhibition"
                    deleteAction={deleteExhibitionAction.bind(null, exhibition.id!)}
                    viewPath={`/exhibitions/${exhibition.id}`}
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
        Could not load exhibitions
      </Typography>
    )}
  </Grid>
  );
}