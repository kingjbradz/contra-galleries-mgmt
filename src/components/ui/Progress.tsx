import { Box, CircularProgress, useMediaQuery } from "@mui/material";

export default function Progress() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: `calc(100vh - ${isMobile ? "56px" : "64px"})`,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
