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
import { Exhibition } from "@/app/(protected)/exhibitions/page";
import ActionButtons from "../ui/ActionButtons";
import { deleteExhibitionAction } from "@/lib/exhibitionActions";
import SearchBar from "@/lib/SearchBar";
import TableScaffold from "../ui/TableScaffold"
import { nonTabletRenderStyles } from "../ui/TableScaffold";

export default function ExhibitionsTable() {
  const router = useRouter()
  const [search, setSearch] = useState("");
  const {
    data: exhibitions,
    page,
    setPage,
    pageCount,
    loading,
  } = usePaginatedQuery<Exhibition>("exhibitions", {
    orderBy: "name",
    ascending: true,
    search,
    searchFields: ["name"],
  });

  return (
    <>
      <SearchBar
        onSearch={setSearch}
        placeholder="Search by exhibition name"
        loading={loading}
      />
      <TableScaffold>
          <TableHead>
            <TableRow>
              <TableCell>Exhibition Name</TableCell>
              <TableCell align="center" sx={nonTabletRenderStyles}>Public</TableCell>
              <TableCell align="center" sx={nonTabletRenderStyles}>Private</TableCell>
              <TableCell align="center" sx={nonTabletRenderStyles}>Onsite</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exhibitions.map((exhibition) => (
              <TableRow
                onClick={() => router.push(`/exhibitions/${exhibition.id}`)}
                key={exhibition.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    cursor: "pointer"
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {exhibition.name}
                </TableCell>
                <TableCell align="center" sx={nonTabletRenderStyles}>
                  {exhibition.public ? "Yes" : "No"}
                </TableCell>
                <TableCell align="center" sx={nonTabletRenderStyles}>
                  {exhibition.private ? "Yes" : "No"}
                </TableCell>
                <TableCell align="center" sx={nonTabletRenderStyles}>
                  {exhibition.onsite ? "Yes" : "No"}
                </TableCell>
                <TableCell align="right">
                  <ActionButtons
                    itemName={exhibition.name}
                    deleteType="exhibition"
                    deleteAction={deleteExhibitionAction.bind(
                      null,
                      exhibition.id!
                    )}
                    viewPath={`/exhibitions/${exhibition.id}`}
                    // no editForm as users should do so on an individual page as there's too many fields, images etc
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
