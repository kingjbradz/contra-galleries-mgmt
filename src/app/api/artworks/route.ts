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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      artist_id = null,
      title = null,
      year = null,
      material = null,
      dimensions = null,
      info = null,
      price = null,
      signed = null,
    } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Artworks title is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("artworks")
      .insert([
        {
          artist_id,
          title,
          year,
          material,
          dimensions,
          info,
          price,
          signed,
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
