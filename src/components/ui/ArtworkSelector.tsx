"use client";

import { useState, useEffect } from "react";
import { 
  Box, TextField, Typography, Checkbox, 
  CircularProgress, InputAdornment, Table, 
  TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Avatar, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { supabase } from "@/lib/supabaseClient";
import { Artwork } from "@/app/(protected)/artworks/page";

interface ArtworkSelectorProps {
  initialSelectedIds: string[];
  onConfirm: (ids: string[]) => void;
}

export default function ArtworkSelector({ initialSelectedIds, onConfirm }: ArtworkSelectorProps) {
  // 1. Local selection state (Staging)
  const [stagedIds, setStagedIds] = useState<string[]>(initialSelectedIds);
  
  // 2. Data & Search state
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic: update debouncedSearch after 500ms of no typing
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch logic: runs on mount and whenever debouncedSearch changes
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      
      let query = supabase
        .from("artworks")
        .select(`id, title, artist_name, artwork_images(url)`)
        .order("created_at", { ascending: false })
        .limit(25);

      if (debouncedSearch) {
        // Search across title OR artist_name
        query = query.or(`title.ilike.%${debouncedSearch}%,artist_name.ilike.%${debouncedSearch}%`);
      }

      const { data } = await query;
      if (data) setArtworks(data as unknown as Artwork[]);
      setLoading(false);
    };

    fetchArtworks();
  }, [debouncedSearch]);

  const handleToggle = (id: string) => {
    setStagedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 500 }}>
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search by title or artist..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: loading && <CircularProgress size={20} />
        }}
      />

      {/* Results Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 400, border: "1px solid #eee" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Preview</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artworks.map((art) => {
              const isSelected = stagedIds.includes(art.id ?? "");
              const imgUrl = art.artwork_images?.[0]?.url;

              return (
                <TableRow 
                  key={art.id} 
                  hover 
                  selected={isSelected}
                  onClick={() => handleToggle(art.id ?? "")}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell>
                    <Avatar 
                      src={imgUrl} 
                      variant="rounded" 
                      sx={{ width: 40, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {art.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {art.artist_name}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            {!loading && artworks.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  No artworks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {stagedIds.length} artworks selected
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => onConfirm(stagedIds)}
          disabled={loading}
        >
          Confirm Selection
        </Button>
      </Box>
    </Box>
  );
}