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
    

    return NextResponse.json({ success: true, user: session });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
