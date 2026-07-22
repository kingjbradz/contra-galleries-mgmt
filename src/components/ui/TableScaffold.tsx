import { Paper, Table, TableContainer } from "@mui/material"

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