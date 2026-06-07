import { notFound } from "next/navigation";
import { prisma } from "../../../_lib/prisma";
import { ProjectForm } from "../_components/project-form";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { tags: true },
  });

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Edit Project: {project.title}</h1>
      <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
