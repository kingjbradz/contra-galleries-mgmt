import Link from "next/link";
import { Box, Button, Grid, IconButton } from "@mui/material";
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
  console.log("redirectPath", redirectPath)
  return (
    <Grid
      size={{ xs: 12 }}
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
    >
      <Link href={redirectPath!}>
        <Button startIcon={<ArrowBackIcon />} size="small" sx={{ color: "grey.700" }}>{redirectPath!.length > 8 ? "list" : redirectPath!.slice(1)}</Button>
      </Link>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ActionButtons
          itemName={itemName}
          deleteType={deleteType}
          deleteAction={deleteAction}
          redirectPath={redirectPath}
          editForm={editForm}
        />
      {extraComponent || <Box></Box>}
      </Box>
    </Grid>
  );
}
