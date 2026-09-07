import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SignOutButton from "../components/auth/SignOutButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task workspace",
  description: "A focused workspace for managing team tasks.",
};

function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <nav
          className="flex items-center gap-8"
          aria-label="Primary navigation"
        >
          <Link href="/" className="text-lg font-bold tracking-tight text-ink">
            Task workspace
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-muted sm:flex">
            <Link href="/" className="text-ink">
              Workspace
            </Link>
          </div>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted md:block">Maya Chen</span>
          <SignOutButton />
          <span
            className="flex size-9 items-center justify-center rounded-full bg-sage text-sm font-semibold text-white"
            aria-label="Maya Chen profile"
          >
            MC
          </span>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
