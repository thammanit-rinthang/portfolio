import { prisma } from "../../_lib/prisma";
import { updateProfileAction } from "../../_lib/actions/admin";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Edit Profile</h1>
      <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
        <form action={updateProfileAction as unknown as (formData: FormData) => void} className="flex flex-col gap-5">
          <input type="hidden" name="id" value={profile?.id || ""} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">Name</label>
              <input id="name" name="name" defaultValue={profile?.name || ""} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="headline">Headline</label>
              <input id="headline" name="headline" defaultValue={profile?.headline || ""} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="summary">Summary</label>
            <textarea id="summary" name="summary" rows={4} defaultValue={profile?.summary || ""} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" defaultValue={profile?.email || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="location">Location</label>
              <input id="location" name="location" defaultValue={profile?.location || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="githubUrl">GitHub URL</label>
              <input id="githubUrl" name="githubUrl" type="url" defaultValue={profile?.githubUrl || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="linkedinUrl">LinkedIn URL</label>
              <input id="linkedinUrl" name="linkedinUrl" type="url" defaultValue={profile?.linkedinUrl || ""} className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="isPublished" name="isPublished" defaultChecked={profile?.isPublished} className="h-4 w-4" />
            <label htmlFor="isPublished" className="text-sm font-medium">Publish Profile</label>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
