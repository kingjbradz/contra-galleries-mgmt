"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Progress from "@/components/ui/Progress";
import Box from "@mui/material/Box";
import Navbar from "@/components/navbar/Navbar";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { pageHeader } = usePageHeader();
  
  // useEffect(() => {
  //   // Only redirect after loading finishes
  //   if (!loading && !user) {
  //     router.replace("/login");
  //   }
  // }, [loading, user, router]);

  // While we are hydrating, show a small loader to avoid flicker.
  if (loading || !user) {
    return (
      <Progress />
    );
  }

  // If not loading and there's no user, effect above will redirect.
  // if (!user) {
  //   // Return null to avoid rendering protected UI briefly while redirect happens.
  //   return null;
  // }

  return (
    <>
      <Navbar title={pageHeader.title} />
      <main>{children}</main>
    </>
  );
}
