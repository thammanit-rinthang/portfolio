import Link from "next/link";
import { prisma } from "../../_lib/prisma";
import { deleteProjectAction } from "../../_lib/actions/admin";
import { DeleteButton } from "../_components/delete-button";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <Link href="/admin/projects/new" className="btn-primary">
          + New Project
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[color:var(--line)] bg-[color:var(--surface-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--line)]">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-[color:var(--surface-muted)]">
                <td className="px-4 py-3 font-medium">{project.title}</td>
                <td className="px-4 py-3 text-[color:var(--muted)]">{project.slug}</td>
                <td className="px-4 py-3">
                  {project.isPublished ? (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">Published</span>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Draft</span>
                  )}
                  {project.isFeatured && (
                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">Featured</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end items-center gap-3">
                    <Link href={`/admin/projects/${project.slug}`} className="font-medium text-[color:var(--accent)] hover:underline">
                      Edit
                    </Link>
                    <DeleteButton
                      id={project.id}
                      action={deleteProjectAction}
                      label="Delete"
                      confirmMessage={`Are you sure you want to delete the project "${project.title}"?`}
                      className="font-medium text-red-500 hover:underline bg-transparent border-0 p-0 shadow-none hover:bg-transparent cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[color:var(--muted)]">
                  No projects found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
