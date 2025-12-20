import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; 

export default async function RootPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (session) {
    redirect("/dashboard");
  }

  redirect("/login");
}
