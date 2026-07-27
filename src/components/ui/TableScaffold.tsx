import { Paper, Table, TableContainer } from "@mui/material"

export const nonMobileRenderStyles = {
  display: {
    xs: "none",
    sm: "table-cell"
  }
}

export const nonTabletRenderStyles = {
   display: {
    ...nonMobileRenderStyles.display,
    sm: "none",
    md: "table-cell"
  }
}

export default function TableScaffold({ children }: { children: React.ReactNode }) {
  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: {
      xs: 350,
      sm: 590,
      md: 650
    } }} aria-label="simple table">
      {children}
    </Table>
  </TableContainer>
  )
}