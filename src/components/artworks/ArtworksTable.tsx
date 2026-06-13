"use client";
import { useState } from "react";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Paper,
  Box,
} from "@mui/material";
import { Artwork } from "@/app/(protected)/artworks/page";
import ActionButtons from "../ui/ActionButtons";
import { deleteArtworkAction } from "@/lib/artworkActions";
import SearchBar from "@/lib/SearchBar";

export default function ArtworksTable() {
  const [search, setSearch] = useState("");

  const {
    data: artworks,
    page,
    setPage,
    pageCount,
    loading,
  } = usePaginatedQuery<Artwork>("artworks", {
    orderBy: "created_at",
    ascending: true,
    search,
    searchFields: ["title", "artist_name"],
  });

  return (
    <>
      <SearchBar
        onSearch={setSearch}
        placeholder="Search by title or artist"
        loading={loading}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="center">Artist</TableCell>
              <TableCell align="center">Year</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Material</TableCell>
              <TableCell align="center">Signed?</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artworks.map((artwork) => (
              <TableRow
                key={artwork.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {artwork.title}
                </TableCell>
                <TableCell align="center">{artwork.artist_name}</TableCell>
                <TableCell align="center">{artwork.year}</TableCell>
                <TableCell align="center">{artwork.price}</TableCell>
                <TableCell align="center">{artwork.material}</TableCell>
                <TableCell align="center">
                  {artwork.signed ? "Yes" : "No"}
                </TableCell>
                <TableCell align="right">
                  <ActionButtons
                    itemName={artwork.title}
                    deleteType="artwork"
                    deleteAction={deleteArtworkAction.bind(null, artwork.id!)}
                    viewPath={`/artworks/${artwork.id}`}
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
