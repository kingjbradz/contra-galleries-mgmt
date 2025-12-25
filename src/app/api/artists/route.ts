import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("artists")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("GET /api/artists error:", error);
      return NextResponse.json(
        { error: "Failed to fetch artists" },
        { status: 500 }
      );
    }

    return NextResponse.json({ artists: data });
  } catch (err) {
    console.error("GET /api/artists exception:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, bio = null } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Artist name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("artists")
      .insert([
        {
          name,
          bio,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("CREATE ARTIST ERROR:", error);
      return NextResponse.json(
        { error: "Failed to create artist" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("CREATE ARTIST ERROR:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}