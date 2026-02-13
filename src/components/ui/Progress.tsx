import { Box, CircularProgress } from "@mui/material";

export default function Progress() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: {
            xs: "calc(100vh - 56px)",
            sm: "calc(100vh - 64px)"
          }
      }}
    >
      <CircularProgress />
    </Box>
  );
}
