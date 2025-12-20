'use client';
import { ReactNode } from 'react';
import { Box } from '@mui/material';

export default function ArtistsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box>{children}</Box>
    </>
  );
}
