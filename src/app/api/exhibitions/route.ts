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
      .select(`
        id,
        name,
        slug,
        description,
        cover_image,
        exhibition_artworks (
          artwork_id,
          artworks (
            id,
            title,
            slug,
            info,
            year,
            signed,
            material,
            dimensions,
            artist_name,
            artwork_images (
              id,
              url,
              is_cover
            )
          )
        )
      `) // join exhibition artworks and then artwork images
      .eq(environment, true);

    if (error) throw error;

    const flattened = data.map(exhibition => ({
      ...exhibition,
      artworks: exhibition.exhibition_artworks.map(ea => ea.artworks),
      exhibition_artworks: undefined
    }));

    return NextResponse.json({ exhibitions: flattened });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
