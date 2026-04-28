import type { Metadata } from "next";
import "./globals.css";
import { AppApolloProvider } from "@/lib/apollo/provider";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PokéForge",
  description: "GraphQL Analyzer demo app — Pokémon team builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppApolloProvider>
          <header className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3 flex items-center gap-8">
            <span className="text-lg font-bold text-[var(--accent)]">PokéForge</span>
            <nav className="flex gap-6 text-sm text-[var(--text-muted)]">
              <Link href="/pokedex" className="hover:text-[var(--text)]">
                Pokédex
              </Link>
              <Link href="/teams" className="hover:text-[var(--text)]">
                Teams
              </Link>
              <Link href="/battle/new" className="hover:text-[var(--text)]">
                Battle
              </Link>
              <Link href="/sign-in" className="hover:text-[var(--text)]">
                Sign In
              </Link>
            </nav>
          </header>
          <main className="min-h-screen px-6 py-8 max-w-6xl mx-auto">{children}</main>
        </AppApolloProvider>
      </body>
    </html>
  );
}
