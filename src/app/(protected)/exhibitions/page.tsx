"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";
import Progress from "@/components/ui/Progress";

export default function ExhibitionsPage() {
  const { user, loading } = useAuth();
  const { setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader({ title: "Exhibitions" });
  }, []);

  if (loading) return <Progress />;
  if (!user) return <Progress />; // fallback, AuthProvider handles redirect
  return (
    <>
     exhibitions page
    </>
  );
}