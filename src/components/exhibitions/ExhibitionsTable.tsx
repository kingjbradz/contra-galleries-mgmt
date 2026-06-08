'use client'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Pagination, Paper } from '@mui/material'
import { Exhibition } from '@/app/(protected)/exhibitions/page'
import ActionButtons from '../ui/ActionButtons'
import { deleteExhibitionAction } from '@/lib/exhibitionActions'

export default function ExhibitionsTable() {
  const { data: exhibitions, page, setPage, pageCount } = usePaginatedQuery<Exhibition>('exhibitions', { orderBy: 'name', ascending: true})

  return (
    <>
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
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
      />
    </>
  )
}