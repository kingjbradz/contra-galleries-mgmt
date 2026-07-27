"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import {
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
} from "@mui/material";
import TableScaffold from "../ui/TableScaffold";
import { Artwork } from "@/app/(protected)/artworks/page";
import ActionButtons from "../ui/ActionButtons";
import { deleteArtworkAction } from "@/lib/artworkActions";
import SearchBar from "@/lib/SearchBar";
import { nonMobileRenderStyles, nonTabletRenderStyles } from "../ui/TableScaffold";

export default function ArtworksTable() {
  const router = useRouter()
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

      <TableScaffold>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="center">Artist</TableCell>
              <TableCell align="center" sx={nonMobileRenderStyles}>Year</TableCell>
              <TableCell align="center" sx={nonMobileRenderStyles}>Price</TableCell>
              <TableCell align="center" sx={nonTabletRenderStyles}>Material</TableCell>
              <TableCell align="center" sx={nonTabletRenderStyles}>Signed?</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artworks.map((artwork) => (
              <TableRow
                onClick={() => router.push(`/artworks/${artwork.id}`)}
                key={artwork.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    cursor: "pointer"
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {artwork.title}
                </TableCell>
                <TableCell align="center">{artwork.artist_name}</TableCell>
                <TableCell align="center" sx={nonMobileRenderStyles}>{artwork.year}</TableCell>
                <TableCell align="center" sx={nonMobileRenderStyles}>{artwork.price}</TableCell>
                <TableCell align="center" sx={nonTabletRenderStyles}>{artwork.material}</TableCell>
                <TableCell align="center" sx={nonTabletRenderStyles}>
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
        </TableScaffold>
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
