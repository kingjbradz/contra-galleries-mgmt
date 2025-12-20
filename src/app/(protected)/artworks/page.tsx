"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/PageHeaderContext";
import { CircularProgress } from "@mui/material";

export default function ArtworksPage() {
  const { user, loading } = useAuth();
  const { setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader({ title: "Artworks" });
  }, []);

  if (loading) return <CircularProgress />;
  if (!user) return <CircularProgress />; // fallback, AuthProvider handles redirect
  return (
    <>
     artworks page
    </>
  );
}