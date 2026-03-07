import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Helper to get params (required for Next.js 15)
type RouteParams = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: RouteParams }) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("artworks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /artworks/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}