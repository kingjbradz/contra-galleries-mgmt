import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const [artistsRes, artworksRes, exhibitionsRes] = await Promise.all([
      supabaseAdmin.from("artists").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("artworks").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("exhibitions").select("*", { count: "exact", head: true })
    ]);

    // Check for any errors in the batch
    if (artistsRes.error || artworksRes.error || exhibitionsRes.error) {
       return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }

    return NextResponse.json({
      artists: artistsRes.count,
      artworks: artworksRes.count,
      exhibitions: exhibitionsRes.count
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}