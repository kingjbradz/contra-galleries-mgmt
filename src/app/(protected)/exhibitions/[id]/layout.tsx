import { ReactNode } from "react";

export default function ExhibitionLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}