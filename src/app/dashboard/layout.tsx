'use client';
import { ReactNode } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { Box } from '@mui/material';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar title="Dashboard" />
      <Box padding={3}>{children}</Box>
    </>
  );
}
