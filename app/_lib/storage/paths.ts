export function buildResumePath(filename = "thammanit-rinthang-resume-v1.pdf") {
  return `resume/${normalizeStorageFilename(filename)}`;
}

export function buildProjectImagePath(projectSlug: string, filename: string) {
  return `${normalizeStorageSegment(projectSlug)}/${normalizeStorageFilename(filename)}`;
}

export function normalizeStorageSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeStorageFilename(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `${crypto.randomUUID()}.bin`;
}

