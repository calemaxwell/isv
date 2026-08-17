import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MemberProvider } from "@/lib/member-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISV Member Portal",
  description:
    "Prototype of the future Independent Schools Victoria Member Portal experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <MemberProvider>{children}</MemberProvider>
      </body>
    </html>
  );
}
