import { prisma } from "../../_lib/prisma";
import { upsertSkillAction, deleteSkillAction } from "../../_lib/actions/admin";
import { DeleteButton } from "../_components/delete-button";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { priority: "asc" }],
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Skills</h1>

      {/* Add New Skill Form */}
      <div className="mb-8 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Add New Skill</h2>
        <form action={upsertSkillAction as unknown as (formData: FormData) => void} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">Skill Name</label>
              <input id="name" name="name" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="e.g. TypeScript" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="category">Category (Group)</label>
              <input id="category" name="category" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" placeholder="e.g. Languages, Frontend, Backend" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="priority">Priority (Sort Order)</label>
              <input id="priority" name="priority" type="number" defaultValue="0" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="isPublished" name="isPublished" defaultChecked className="h-4 w-4" />
              <label htmlFor="isPublished" className="text-sm font-medium">Published</label>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">Add Skill</button>
          </div>
        </form>
      </div>

      {/* Skills list grouped by category */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Current Skills</h2>
        {skills.length === 0 ? (
          <p className="text-[color:var(--muted)]">No skills added yet.</p>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm">
                <form action={upsertSkillAction as unknown as (formData: FormData) => void} className="flex flex-col gap-4">
                  <input type="hidden" name="id" value={skill.id} />
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium" htmlFor={`name-${skill.id}`}>Skill Name</label>
                        <input id={`name-${skill.id}`} name="name" defaultValue={skill.name} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium" htmlFor={`category-${skill.id}`}>Category</label>
                        <input id={`category-${skill.id}`} name="category" defaultValue={skill.category} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium" htmlFor={`priority-${skill.id}`}>Priority</label>
                        <input id={`priority-${skill.id}`} name="priority" type="number" defaultValue={skill.priority} required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input type="checkbox" id={`isPublished-${skill.id}`} name="isPublished" defaultChecked={skill.isPublished} className="h-4 w-4" />
                        <label htmlFor={`isPublished-${skill.id}`} className="text-sm font-medium">Published</label>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 pt-6">
                      <button type="submit" className="btn-primary text-sm px-3 py-1.5">Save</button>
                      <DeleteButton 
                        id={skill.id} 
                        action={deleteSkillAction} 
                        confirmMessage={`Are you sure you want to delete the skill "${skill.name}"?`}
                        className="btn-secondary text-red-500 text-sm px-3 py-1.5 border border-[color:var(--line)] hover:bg-red-50 dark:hover:bg-red-950/20"
                      />
                    </div>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
