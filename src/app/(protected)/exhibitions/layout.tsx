'use client';
import { ReactNode } from 'react';
import { Box } from '@mui/material';

export default function ExhibitionsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box>{children}</Box>
    </>
  );
}
