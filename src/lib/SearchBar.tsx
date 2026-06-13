"use client";

import { useState, useEffect } from "react";
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  debounceMs = 500,
  loading = false,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(handler);
  }, [value, debounceMs, onSearch]);

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: loading && <CircularProgress size={20} />,
      }}
    />
  );
}