import { prisma } from "../../_lib/prisma";
import { verifyAdminSession } from "../../_lib/auth";
import { MediaUploadForms } from "./media-forms";
import { DeleteButton } from "../_components/delete-button";
import { deleteProjectImageAction } from "../../_lib/actions/admin";

export default async function AdminMediaPage() {
  // Protect page server-side
  await verifyAdminSession();

  // Fetch data
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  const projectImages = await prisma.projectImage.findMany({
    where: { deletedAt: null },
    include: {
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold">Media & Assets</h1>
        <p className="text-sm text-[color:var(--muted)] mt-1">Manage resume documents and project screenshots.</p>
      </div>

      {/* Upload Forms */}
      <MediaUploadForms projects={projects} currentResumeUrl={profile?.resumeUrl || null} />

      {/* Project Images Gallery */}
      <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Project Screenshots Gallery</h2>
        
        {projectImages.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">No project images uploaded yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {projectImages.map((img) => (
              <div key={img.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
                {/* Image Preview */}
                <div className="aspect-video w-full overflow-hidden bg-black/5 dark:bg-white/5 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.imageUrl} 
                    alt={img.alt} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {img.isCover && (
                    <span className="absolute top-2 left-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                      Cover
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-4 text-sm">
                  <div className="font-semibold text-[color:var(--ink)] truncate" title={img.project.title}>
                    {img.project.title}
                  </div>
                  <div className="text-xs text-[color:var(--muted)] mt-1 truncate" title={img.imagePath || ""}>
                    <span className="font-medium">Path:</span> {img.imagePath}
                  </div>
                  <div className="text-xs text-[color:var(--muted)] mt-0.5 truncate" title={img.alt}>
                    <span className="font-medium">Alt:</span> {img.alt}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end">
                    <DeleteButton
                      id={img.id}
                      action={deleteProjectImageAction}
                      label="Delete Image"
                      confirmMessage="Are you sure you want to delete this project screenshot from the database and storage?"
                      className="text-xs text-red-500 font-semibold hover:underline bg-transparent border-0 p-0 shadow-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
