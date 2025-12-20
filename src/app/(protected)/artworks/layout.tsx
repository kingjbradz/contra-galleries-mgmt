'use client';
import { ReactNode } from 'react';
import { Box } from '@mui/material';

export default function ArtworksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box>{children}</Box>
    </>
  );
}
