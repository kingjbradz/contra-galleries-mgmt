// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs'; // ensure cookie APIs work reliably

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour
const SESSION_MAX_AGE = SESSION_DURATION_MS / 1000; // seconds

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Lookup user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, password_hash, role')
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Verify password
    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Session payload (no sensitive data)
    const sessionData = {
      id: user.id,
      username: user.username,
      role: user.role,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    // Build response and attach cookie
    const res = NextResponse.json(
      { message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } },
      { status: 200 }
    );

    // Attach signed-ish cookie (JSON string). For stricter security you can sign/encrypt it.
    res.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE, // seconds
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
