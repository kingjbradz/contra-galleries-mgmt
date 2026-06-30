"use client";
import { useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useRouter } from "next/navigation";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Paper,
} from "@mui/material";
import { Artist } from "@/app/(protected)/artists/page";
import ActionButtons from "../ui/ActionButtons";
import { deleteArtistAction } from "@/lib/artistActions";
import SearchBar from "@/lib/SearchBar";

export default function ArtistsTable() {
  const router = useRouter()
  const [search, setSearch] = useState("");
  const {
    data: artists,
    page,
    setPage,
    pageCount,
    loading,
  } = usePaginatedQuery<Artist>("artists", {
    orderBy: "name",
    ascending: true,
    search,
    searchFields: ["name"],
  });

  return (
    <>
      <SearchBar
        onSearch={setSearch}
        placeholder="Search by artist name"
        loading={loading}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Artist Name</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artists.map((artist) => (
              <TableRow
                onClick={() => router.push(`/artists/${artist.id}`)}
                key={artist.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    cursor: "pointer"
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {artist.name}
                </TableCell>
                <TableCell align="right">
                  <ActionButtons
                    itemName={artist.name}
                    deleteType="artist"
                    deleteAction={deleteArtistAction.bind(null, artist.id!)}
                    viewPath={`/artists/${artist.id}`}
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
        sx={{ display: "flex", justifyContent: "center", mt: 3 }}
      />
    </>
  );
}
