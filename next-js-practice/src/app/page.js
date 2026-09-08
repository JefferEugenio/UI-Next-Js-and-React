import Dashboard from "../components/dashboard/Dashboard";
import { auth } from "../../auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
      <Dashboard
        userId={session.user.id}
        userName={session.user.name}
        userRole={session.user.role}
      />
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-5 py-16 sm:px-8 lg:px-10">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">
          Task workspace
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-ink sm:text-7xl">
          Make the next step clear.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          A simple workspace for organizing team tasks, tracking progress, and
          keeping ownership visible.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 text-sm font-semibold text-white hover:bg-[#23352e]"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white px-5 text-sm font-semibold text-ink hover:bg-mist"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
