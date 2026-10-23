import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Puerto Rico Translation Inconsistencies", template: "%s · Puerto Rico Translation Inconsistencies" },
  description: "A transparent reader for potential differences in legal meaning between original Spanish legislation and its official English translation in Puerto Rico.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="min-h-screen antialiased"><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
