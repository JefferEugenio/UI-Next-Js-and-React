"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isRegistering = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Could not create account.");
        }
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) throw new Error("Invalid email or password.");
      router.push("/");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isRegistering && <div><label htmlFor="name" className="text-sm font-semibold text-ink">Name</label><input id="name" name="name" value={form.name} onChange={handleChange} required className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-terracotta" /></div>}
  <div><label htmlFor="email" className="text-sm font-semibold text-ink">Email</label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-terracotta" /></div>
  <div><label htmlFor="password" className="text-sm font-semibold text-ink">Password</label><input id="password" name="password" type="password" minLength={8} value={form.password} onChange={handleChange} required className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-terracotta" /></div>
  {error && <p className="text-sm text-terracotta" role="alert">{error}</p>}
  <button type="submit" disabled={isSubmitting} className="min-h-11 w-full rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? "Please wait..." : isRegistering ? "Create account" : "Sign in"}</button>
    </form>
  );
}
