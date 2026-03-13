import Link from "next/link";
import { Box, Grid, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ActionButtons from "@/components/ui/ActionButtons";
import { DeleteableType } from "./DeleteConfirmation";

interface IndividualPageActionRowProps {
  itemName?: string | undefined;
  deleteType: DeleteableType;
  redirectPath?: string; // Where to go after a delete (optional)
  editForm: React.ReactElement; // The Form component (e.g., <EditArtistForm />)
  deleteAction: () => Promise<{ success?: boolean; error?: string }>;
  extraComponent?: React.ReactNode;
}

export default function IndividualPageActionRow({
  itemName,
  deleteType,
  redirectPath,
  deleteAction,
  editForm,
  extraComponent,
}: IndividualPageActionRowProps) {
  return (
    <Grid
      size={{ xs: 12 }}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Link href={redirectPath!}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <Box>
        <ActionButtons
          itemName={itemName}
          deleteType={deleteType}
          deleteAction={deleteAction}
          redirectPath={redirectPath}
          editForm={editForm}
        />
      </Box>
      {extraComponent || <Box></Box>}
    </Grid>
  );
}
