import { env } from "../env";

export const storageBuckets = {
  resume: env.SUPABASE_RESUME_BUCKET,
  projectImages: env.SUPABASE_PROJECT_IMAGES_BUCKET,
  ogImages: env.SUPABASE_OG_IMAGES_BUCKET,
  privateUploads: env.SUPABASE_PRIVATE_UPLOADS_BUCKET,
} as const;

export const storageLimits = {
  resumePdfBytes: 5 * 1024 * 1024,
  projectImageBytes: 3 * 1024 * 1024,
  ogImageBytes: 2 * 1024 * 1024,
} as const;

export const allowedStorageMimeTypes = {
  resume: ["application/pdf"],
  image: ["image/png", "image/jpeg", "image/webp"],
} as const;

