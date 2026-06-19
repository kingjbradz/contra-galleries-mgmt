import { Typography, useMediaQuery } from "@mui/material"

export default function Title({ title }: { title: String }) {
  const isNotMobile = useMediaQuery("(min-width: 500px)")
  return (
    isNotMobile ?
    <Typography variant="h5" sx={{ textAlign: "center" }}>{title}</Typography>
    : 
    <Typography variant="body1" sx={{ textAlign: "center" }}>{`${title.slice(0,20)}..`}</Typography>
  )
}