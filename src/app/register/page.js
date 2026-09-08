import Link from "next/link";
import AuthForm from "../../components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
      <section className="rounded-xl border border-line bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">
          Task workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Start organizing your team&apos;s work.
        </p>
        <div className="mt-8">
          <AuthForm mode="register" />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-terracotta">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
