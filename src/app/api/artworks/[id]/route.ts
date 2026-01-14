import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Params = {
  params: { id: string };
};

// Helper to get params (required for Next.js 15)
type RouteParams = Promise<{ id: string }>;

export async function GET(
  req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("artworks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Artwork not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /artworks/[id] error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: { name?: string; bio?: string } = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("artworks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ artist: data });
  } catch (err) {
    console.error("PUT /artworks error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(_: Request, { params }: Params) {
  const artworkId = params.id;

  if (!artworkId) {
    return NextResponse.json(
      { error: "Artwork ID required" },
      { status: 400 }
    );
  }

  /* 1️⃣ Check artworks */
  const { data: artworks, error: artworkError } = await supabaseAdmin
    .from("artworks")
    .select("id")
    .limit(1);

  if (artworkError) {
    return NextResponse.json(
      { error: "Failed checking artworks" },
      { status: 500 }
    );
  }


  /* 3️⃣ Safe to delete */
  const { error: deleteError } = await supabaseAdmin
    .from("artworks")
    .delete()
    .eq("id", artworkId);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete artwork" },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}