import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("artworks")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("GET /api/artworks error:", error);
      return NextResponse.json(
        { error: "Failed to fetch artworks" },
        { status: 500 }
      );
    }

    return NextResponse.json({ artworks: data });
  } catch (err) {
    console.error("GET /api/artworks exception:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, 
      // info = null, 
      // bio = null 
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Artworks name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("artworks")
      .insert([
        {
          name,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("CREATE ARTWORK ERROR:", error);
      return NextResponse.json(
        { error: "Failed to create artwork" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("CREATE ARTWORK ERROR:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}