import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("exhibitions")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("GET /api/exhibitions error:", error);
      return NextResponse.json(
        { error: "Failed to fetch exhibitions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ exhibitions: data });
  } catch (err) {
    console.error("GET /api/exhibitions exception:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
