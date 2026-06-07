"use client";

import { useActionState } from "react";
import Link from "next/link";
import { upsertProjectAction } from "../../../_lib/actions/admin";
import type { Project, ProjectTag } from "../../../generated/prisma/client";

export function ProjectForm({ project }: { project?: Partial<Project> & { tags?: ProjectTag[] } }) {
  const [state, formAction, isPending] = useActionState(async (prevState: unknown, formData: FormData) => {
    return await upsertProjectAction(formData);
  }, null);

  const stackArray = Array.isArray(project?.stack) ? (project.stack as string[]) : [];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {project?.id && <input type="hidden" name="id" value={project.id} />}
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={project?.title || ""} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="slug">Slug</label>
          <input id="slug" name="slug" defaultValue={project?.slug || ""} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="summary">Summary</label>
        <textarea id="summary" name="summary" rows={2} defaultValue={project?.summary || ""} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="problem">Problem</label>
          <textarea id="problem" name="problem" rows={4} defaultValue={project?.problem || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="solution">Solution</label>
          <textarea id="solution" name="solution" rows={4} defaultValue={project?.solution || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="role">Role</label>
          <input id="role" name="role" defaultValue={project?.role || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="stack">Stack (comma-separated)</label>
          <input id="stack" name="stack" defaultValue={stackArray.join(", ") || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="Next.js, TypeScript, Supabase" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" name="tags" defaultValue={project?.tags?.map(t => t.tag).join(", ") || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="e.g. web, react, portfolio" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="deployment">Deployment</label>
          <input id="deployment" name="deployment" defaultValue={project?.deployment || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium" htmlFor="impact">Impact / Outcome</label>
          <input id="impact" name="impact" defaultValue={project?.impact || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="githubUrl">GitHub URL</label>
          <input id="githubUrl" name="githubUrl" type="url" defaultValue={project?.githubUrl || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="demoUrl">Demo URL</label>
          <input id="demoUrl" name="demoUrl" type="url" defaultValue={project?.demoUrl || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
      </div>

      <div className="flex gap-6 border-y border-[color:var(--line)] py-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPublished" name="isPublished" defaultChecked={project?.isPublished ?? true} className="h-4 w-4" />
          <label htmlFor="isPublished" className="text-sm font-medium">Published</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={project?.isFeatured ?? false} className="h-4 w-4" />
          <label htmlFor="isFeatured" className="text-sm font-medium">Featured</label>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sortOrder" className="text-sm font-medium">Sort Order</label>
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={project?.sortOrder || 0} className="w-20 rounded-md border border-[color:var(--line)] bg-transparent px-2 py-1 text-sm outline-none focus:border-[color:var(--accent)]" />
        </div>
      </div>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/30">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/30">
          Project saved successfully!
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Link href="/admin/projects" className="btn-secondary">Cancel</Link>
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-50">
          {isPending ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}
