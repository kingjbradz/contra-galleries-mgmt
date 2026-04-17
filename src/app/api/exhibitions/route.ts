import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  const environment = request.headers.get("x-environment");
  const apiKey = request.headers.get("x-api-key");

  if (!environment) {
    return NextResponse.json({ error: "No environment" }, { status: 400 });
  }

  if (environment !== "public" && apiKey !== process.env.INTERNAL_VIEWER_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("exhibitions")
      .select("id, name, slug, description")
      .eq(environment, true);

    if (error) throw error;

    return NextResponse.json({ exhibitions: data });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
