import { ReactNode } from "react";

export default function ArtistsLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}