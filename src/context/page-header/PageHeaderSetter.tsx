"use client";

import { useEffect } from "react";
import { usePageHeader } from "@/context/page-header/PageHeaderContext";

export function PageHeaderSetter({ title }: { title: string }) {
  const { setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader({ title });
  }, [title, setPageHeader]);

  return null;
}
