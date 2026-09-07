import Link from "next/link";
import AuthForm from "../../components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
      <section className="rounded-xl border border-line bg-white p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">
          Task workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Use your account to manage your tasks.
        </p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="font-semibold text-terracotta">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
