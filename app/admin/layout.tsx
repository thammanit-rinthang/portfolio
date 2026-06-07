import Link from "next/link";
import { logoutAction } from "../_lib/actions/auth";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[color:var(--surface)] text-[color:var(--ink)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5">
        <div className="mb-8">
          <Link href="/" className="text-sm font-semibold tracking-wide text-[color:var(--accent)] hover:underline">
            &larr; Back to Public Site
          </Link>
          <h2 className="mt-4 text-xl font-semibold">Admin Panel</h2>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="rounded-md px-3 py-2 text-sm hover:bg-[color:var(--line)]">
            Dashboard
          </Link>
          <Link href="/admin/profile" className="rounded-md px-3 py-2 text-sm hover:bg-[color:var(--line)]">
            Profile
          </Link>
          <Link href="/admin/projects" className="rounded-md px-3 py-2 text-sm hover:bg-[color:var(--line)]">
            Projects
          </Link>
          <Link href="/admin/experience" className="rounded-md px-3 py-2 text-sm hover:bg-[color:var(--line)]">
            Experience
          </Link>
          <Link href="/admin/skills" className="rounded-md px-3 py-2 text-sm hover:bg-[color:var(--line)]">
            Skills
          </Link>
          <Link href="/admin/media" className="rounded-md px-3 py-2 text-sm hover:bg-[color:var(--line)]">
            Media
          </Link>
        </nav>

        <div className="mt-auto pt-8">
          <form action={logoutAction}>
            <button type="submit" className="w-full rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-[color:var(--line)]">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
