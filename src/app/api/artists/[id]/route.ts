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
      .from("artists")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /artists/[id] error:", err);
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
      .from("artists")
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
    console.error("PUT /artists error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(_: Request, { params }: Params) {
  const artistId = params.id;

  if (!artistId) {
    return NextResponse.json(
      { error: "Artist ID required" },
      { status: 400 }
    );
  }

  /* 1️⃣ Check artworks */
  const { data: artworks, error: artworkError } = await supabaseAdmin
    .from("artworks")
    .select("id")
    .eq("artist_id", artistId)
    .limit(1);

  if (artworkError) {
    return NextResponse.json(
      { error: "Failed checking artworks" },
      { status: 500 }
    );
  }

  if (artworks && artworks.length > 0) {
    return NextResponse.json(
      { error: "Artist has associated artworks" },
      { status: 409 }
    );
  }

  /* 2️⃣ Check exhibitions (join table) */
  const { data: exhibitions, error: exhibitionError } = await supabaseAdmin
    .from("exhibition_artists")
    .select("artist_id")
    .eq("artist_id", artistId)
    .limit(1);

  if (exhibitionError) {
    return NextResponse.json(
      { error: "Failed checking exhibitions" },
      { status: 500 }
    );
  }

  if (exhibitions && exhibitions.length > 0) {
    return NextResponse.json(
      { error: "Artist is used in exhibitions" },
      { status: 409 }
    );
  }

  /* 3️⃣ Safe to delete */
  const { error: deleteError } = await supabaseAdmin
    .from("artists")
    .delete()
    .eq("id", artistId);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete artist" },
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}