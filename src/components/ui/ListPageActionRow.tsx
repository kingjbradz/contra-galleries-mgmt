import Link from "next/link";
import { Box, Grid, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ListPageActionRowProps {
  extraComponent?: React.ReactNode;
}

export default function ListPageActionRow({

  extraComponent,
}: ListPageActionRowProps) {
  return (
    <Grid
      size={{ xs: 12 }}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Link href="/">
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <Box>

      {extraComponent || <Box></Box>}
      </Box>
    </Grid>
  );
}
