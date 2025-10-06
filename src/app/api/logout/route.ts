// src/app/api/logout/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
const SESSION_COOKIE_NAME = 'session';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  // delete cookie
  res.cookies.delete(SESSION_COOKIE_NAME);

  return res;
}
