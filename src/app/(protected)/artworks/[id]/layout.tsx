import { ReactNode } from "react";

export default function ArtworkLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}