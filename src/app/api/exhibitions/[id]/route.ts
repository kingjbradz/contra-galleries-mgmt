export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      .select("id, name, slug")
      .eq(environment, true);

    if (error) throw error;

    return NextResponse.json({ exhibitions: data });
  } catch (err) {
    return NextResponse.json({ error: "Server Error", err: err }, { status: 500 });
  }
}