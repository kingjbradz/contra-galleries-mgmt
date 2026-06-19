import { Typography, useMediaQuery } from "@mui/material"

export default function Title({ title }: { title: string }) {
  const isNotMobile = useMediaQuery("(min-width: 500px)")
  const displayedTitle = title.length > 20 ? `${title.slice(0, 20)}..` : title;
  return (
    isNotMobile ?
    <Typography variant="h5" sx={{ textAlign: "center" }}>{title}</Typography>
    : 
    <Typography variant="body1" sx={{ textAlign: "center" }}>{displayedTitle}</Typography>
  )
}