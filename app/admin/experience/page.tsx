import { prisma } from "../../_lib/prisma";
import { upsertExperienceAction, deleteExperienceAction } from "../../_lib/actions/admin";
import { DeleteButton } from "../_components/delete-button";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Experience</h1>

      <div className="mb-8 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Add New Experience</h2>
        <form action={upsertExperienceAction as unknown as (formData: FormData) => void} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="company">Company</label>
              <input id="company" name="company" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="role">Role</label>
              <input id="role" name="role" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="e.g. Senior Developer" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="periodLabel">Period</label>
              <input id="periodLabel" name="periodLabel" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="e.g. 2020 - Present" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="sortOrder">Sort Order</label>
              <input id="sortOrder" name="sortOrder" type="number" defaultValue="0" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="isPublished" name="isPublished" defaultChecked className="h-4 w-4" />
              <label htmlFor="isPublished" className="text-sm font-medium">Published</label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="highlights">Highlights (One per line)</label>
            <textarea id="highlights" name="highlights" rows={4} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="- Built scalable architecture&#10;- Led a team of 5 developers" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">Add Experience</button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm">
            <form action={upsertExperienceAction as unknown as (formData: FormData) => void} className="flex flex-col gap-4">
              <input type="hidden" name="id" value={exp.id} />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor={`company-${exp.id}`}>Company</label>
                    <input id={`company-${exp.id}`} name="company" defaultValue={exp.company} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor={`role-${exp.id}`}>Role</label>
                    <input id={`role-${exp.id}`} name="role" defaultValue={exp.role} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor={`period-${exp.id}`}>Period</label>
                    <input id={`period-${exp.id}`} name="periodLabel" defaultValue={exp.periodLabel || ""} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium" htmlFor={`sortOrder-${exp.id}`}>Sort Order</label>
                    <input id={`sortOrder-${exp.id}`} name="sortOrder" type="number" defaultValue={exp.sortOrder} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`isPublished-${exp.id}`} name="isPublished" defaultChecked={exp.isPublished} className="h-4 w-4" />
                    <label htmlFor={`isPublished-${exp.id}`} className="text-sm font-medium">Published</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium" htmlFor={`highlights-${exp.id}`}>Highlights</label>
                    <textarea id={`highlights-${exp.id}`} name="highlights" rows={4} defaultValue={((exp.highlights as string[]) || []).join("\n")} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 pt-6">
                  <button type="submit" className="btn-primary text-sm px-3 py-1.5">Save</button>
                  <DeleteButton 
                    id={exp.id} 
                    action={deleteExperienceAction} 
                    confirmMessage={`Are you sure you want to delete this experience entry at ${exp.company}?`}
                    className="btn-secondary text-red-500 text-sm px-3 py-1.5 border border-[color:var(--line)] hover:bg-red-50 dark:hover:bg-red-950/20"
                  />
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
