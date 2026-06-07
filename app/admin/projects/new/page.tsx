import { ProjectForm } from "../_components/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">New Project</h1>
      <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
        <ProjectForm />
      </div>
    </div>
  );
}
