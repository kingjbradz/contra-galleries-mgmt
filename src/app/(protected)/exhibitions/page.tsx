"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";
import { CircularProgress } from "@mui/material";

export default function ExhibitionsPage() {
  const { user, loading } = useAuth();
  const { setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader({ title: "Exhibitions" });
  }, []);

  if (loading) return <CircularProgress />;
  if (!user) return <CircularProgress />; // fallback, AuthProvider handles redirect
  return (
    <>
     exhibitions page
    </>
  );
}