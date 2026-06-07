import { verifyAdminSession } from "../_lib/auth";

export default async function AdminDashboardPage() {
  const user = await verifyAdminSession();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Dashboard</h1>
      <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
        <p className="text-lg">Welcome back, <span className="font-medium text-[color:var(--accent)]">{user.email}</span>!</p>
        <p className="mt-2 text-[color:var(--muted)]">
          Use the sidebar to manage your portfolio content, projects, and media.
        </p>
      </div>
    </div>
  );
}
