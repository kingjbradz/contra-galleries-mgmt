"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Progress from "@/components/ui/Progress";
import Navbar from "@/components/navbar/Navbar";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { pageHeader } = usePageHeader();

  // While we are hydrating, show a small loader to avoid flicker.
  if (loading || !user) {
    return (
      <Progress />
    );
  }

  return (
    <>
      <Navbar title={pageHeader.title} />
      <main>{children}</main>
    </>
  );
}
