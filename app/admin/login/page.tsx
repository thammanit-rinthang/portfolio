"use client";

import { useActionState } from "react";
import { loginWithEmailAction } from "../../_lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: unknown, formData: FormData) => {
    return await loginWithEmailAction(formData);
  }, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--surface)] px-5">
      <div className="w-full max-w-md rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-[color:var(--ink)]">Admin Login</h1>
        <p className="mb-6 text-sm text-[color:var(--muted)]">Sign in to manage portfolio content.</p>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--accent)]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[color:var(--ink)]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--accent)]"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary mt-2 flex w-full justify-center disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
