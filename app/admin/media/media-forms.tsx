"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectOption {
  id: string;
  title: string;
  slug: string;
}

interface MediaUploadFormsProps {
  projects: ProjectOption[];
  currentResumeUrl: string | null;
}

export function MediaUploadForms({ projects, currentResumeUrl }: MediaUploadFormsProps) {
  const router = useRouter();
  const [resumeUploading, setResumeUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [imagePath, setImagePath] = useState("");

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setImagePath(`projects/${proj.slug}/screenshot.webp`);
    } else {
      setImagePath("");
    }
  };

  const handleResumeUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResumeUploading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;

    if (!file || file.size === 0) {
      setMessage({ type: "error", text: "Please select a PDF file to upload." });
      setResumeUploading(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("bucket", "resume-assets");
    uploadData.append("path", path);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage({ type: "success", text: `Successfully uploaded resume PDF!` });
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Upload failed.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setResumeUploading(false);
    }
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImageUploading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;
    const projectId = formData.get("projectId") as string;
    const alt = formData.get("alt") as string;
    const isCover = formData.get("isCover") === "on";

    if (!file || file.size === 0) {
      setMessage({ type: "error", text: "Please select an image file to upload." });
      setImageUploading(false);
      return;
    }

    if (!projectId) {
      setMessage({ type: "error", text: "Please select a project to link the image to." });
      setImageUploading(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("bucket", "project-images");
    uploadData.append("path", path);
    uploadData.append("projectId", projectId);
    uploadData.append("alt", alt);
    uploadData.append("isCover", isCover ? "true" : "false");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage({ type: "success", text: `Successfully uploaded project image!` });
      (e.target as HTMLFormElement).reset();
      setSelectedProjectId("");
      setImagePath("");
      router.refresh();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Upload failed.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div>
      {message && (
        <div className={`mb-6 rounded-md p-4 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300"}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resume PDF */}
        <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Resume PDF</h2>
          <p className="mb-4 text-sm text-[color:var(--muted)]">Upload or replace your public resume PDF.</p>
          
          {currentResumeUrl && (
            <div className="mb-4 text-sm">
              <span className="font-semibold">Current Resume:</span>{" "}
              <a href={currentResumeUrl} target="_blank" rel="noopener noreferrer" className="text-[color:var(--accent)] hover:underline break-all">
                View current PDF
              </a>
            </div>
          )}

          <form onSubmit={handleResumeUpload} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="resume-file">Select PDF (Max 5MB)</label>
              <input id="resume-file" name="file" type="file" accept="application/pdf" required className="w-full text-sm text-[color:var(--muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[color:var(--surface-muted)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--accent)] hover:file:bg-[color:var(--line)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="resume-path">File Path / Name</label>
              <input id="resume-path" name="path" defaultValue="Thammanit_Rinthang_Resume.pdf" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
              <p className="mt-1 text-xs text-[color:var(--muted)]">Using the same filename will replace the existing resume.</p>
            </div>
            <button type="submit" disabled={resumeUploading} className="btn-primary mt-2 w-full disabled:opacity-50">
              {resumeUploading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>
        </div>

        {/* Project Image */}
        <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Project Image</h2>
          <p className="mb-4 text-sm text-[color:var(--muted)]">Upload images for your project case studies.</p>
          
          <form onSubmit={handleImageUpload} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="project-select">Target Project</label>
              <select 
                id="project-select" 
                name="projectId" 
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                required 
                className="w-full rounded-md border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] text-[color:var(--ink)]"
              >
                <option value="">-- Select a Project --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="project-img-file">Select Image (Max 3MB)</label>
              <input id="project-img-file" name="file" type="file" accept="image/*" required className="w-full text-sm text-[color:var(--muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[color:var(--surface-muted)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--accent)] hover:file:bg-[color:var(--line)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="project-img-path">Storage Path</label>
              <input 
                id="project-img-path" 
                name="path" 
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                placeholder="projects/project-slug/image-name.webp" 
                required 
                className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" 
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="alt-text">Alt Text (Accessibility)</label>
              <input id="alt-text" name="alt" placeholder="e.g. Screenshot of the dashboard page" required className="w-full rounded-md border border-[color:var(--line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isCover" name="isCover" className="h-4 w-4" />
              <label htmlFor="isCover" className="text-sm font-medium">Use as Project Cover Image</label>
            </div>
            <button type="submit" disabled={imageUploading} className="btn-primary mt-2 w-full disabled:opacity-50">
              {imageUploading ? "Uploading..." : "Upload Image"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
