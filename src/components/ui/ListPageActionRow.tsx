"use client"
import React from "react";
import Link from "next/link";
import { Box, Grid, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModalButton from "./ModalButton";
import { useRouter } from "next/navigation";

interface ListPageActionRowProps {
  label: string;
  title: string;
  form: React.ReactElement;
  extraComponent?: React.ReactNode;
}

export default function ListPageActionRow({
  label,
  title,
  form,
  extraComponent,
}: ListPageActionRowProps) {
  const router = useRouter();
  return (
    <Grid
      size={{ xs: 12 }}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Link href="/dashboard">
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      <Box>
      <ModalButton label={label} title={title}>
      {(close) => (
          // We clone the element to pass the close/onSuccess props automatically
          React.cloneElement(form as React.ReactElement<Record<string, unknown>>, {
            onSuccess: () => {
              close();
              router.refresh()
            }
          })
        )}
        </ModalButton>
      {extraComponent || <Box></Box>}
      </Box>
    </Grid>
  );
}
