import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";


// Metadata used by Next.js for document head
export const metadata = {
  title: "CoinLog",
  description: "Track and manage your coin collection",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100">
        {/* Top nav */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/90 text-slate-950 font-black text-lg shadow">
                ₵
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold tracking-tight">CoinLog</span>
                <span className="text-[11px] text-slate-400">
                  Your collection. Organized.
                </span>
              </div>
            </Link>
            {/* Right-side navigation links */}
            <nav className="flex items-center gap-3 text-sm">
              <Link
                href="/coins"
                className="rounded-full px-3 py-1.5 text-slate-200 hover:bg-slate-800/70"
              >
                My Coins
              </Link>
              {/* Sign in button */}
              <Link
                href="/auth/signin"
                className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-amber-300"
              >
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto flex max-w-5xl flex-1 px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-slate-950/70">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} CoinLog</span>
            <span>Track, grade, and value your collection.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
