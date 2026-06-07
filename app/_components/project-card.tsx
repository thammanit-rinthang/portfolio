import Link from "next/link";
import type { Project } from "../_data/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  const coverImage = project.images?.find((image) => image.isCover) ?? project.images?.[0];

  return (
    <article>
      <Link className="project-card project-card-link" href={`/projects/${project.slug}`}>
        {coverImage ? (
          <div className="project-card-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage.url}
              alt={coverImage.alt}
              className="project-card-image"
            />
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <h3 className="text-xl font-semibold text-[color:var(--ink)]">{project.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{project.summary}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
          {project.stack.slice(0, 4).map((item) => (
            <span className="stack-pill" key={item}>
              {item}
            </span>
          ))}
        </div>
        <span className="mt-7 inline-flex text-sm font-semibold text-[color:var(--ink)]">
          Read case study
        </span>
      </Link>
    </article>
  );
}
