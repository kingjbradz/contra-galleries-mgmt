// import { NextResponse } from 'next/server';
// import { supabaseAdmin } from '@/lib/supabaseAdmin';
// import bcrypt from 'bcryptjs';

// export const runtime = 'nodejs'; // ensures stable cookie behavior in dev

// const SESSION_COOKIE_NAME = 'session';
// const SESSION_DURATION_MS = 2000; // 1 hour
// const SESSION_MAX_AGE = SESSION_DURATION_MS / 1000; // seconds

// export async function POST(req: Request) {
//   try {
//     const { username, password } = await req.json();

//     if (!username || !password) {
//       return NextResponse.json(
//         { error: 'Username and password required' },
//         { status: 400 }
//       );
//     }

//     // Fetch user via ADMIN (bypass RLS)
//     const { data: user, error } = await supabaseAdmin
//       .from('users')
//       .select('id, username, password_hash, role')
//       .eq('username', username)
//       .single();

//     console.log('LOGIN USER RESULT:', { user, error });

//     if (error || !user) {
//       return NextResponse.json(
//         { error: 'Invalid username or password' },
//         { status: 401 }
//       );
//     }

//     // Compare password
//     const matches = await bcrypt.compare(password, user.password_hash);

//     if (!matches) {
//       return NextResponse.json(
//         { error: 'Invalid username or password' },
//         { status: 401 }
//       );
//     }

//     // Build session payload that middleware expects
//     const sessionData = {
//       id: user.id,
//       username: user.username,
//       role: user.role,
//       expiresAt: Date.now() + SESSION_DURATION_MS,
//     };

//     // Build response and attach cookie
//     const res = NextResponse.json(
//       { message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } },
//       { status: 200 }
//     );

//     res.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       path: '/',
//       maxAge: SESSION_MAX_AGE,
//     });

//     return res;
//   } catch (err) {
//     console.error('LOGIN ERROR:', err);
//     return NextResponse.json(
//       { error: 'Server error' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing creds" }, { status: 400 });
    }

    // Fetch user
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, username, password_hash, role")
      .eq("username", username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid login" }, { status: 401 });
    }

    // Validate password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid login" }, { status: 401 });
    }

    // ✔️ Create session object
    const session = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // ✔️ Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
