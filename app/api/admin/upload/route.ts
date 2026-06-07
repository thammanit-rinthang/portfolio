import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "../../../_lib/auth";
import { createSupabaseServiceClient } from "../../../_lib/supabase/server";
import { prisma } from "../../../_lib/prisma";
import { verifyRateLimit } from "../../../_lib/rate-limit";
import { logger } from "../../../_lib/logger";

// Allowed buckets and configurations
const BUCKET_CONFIGS: Record<string, { maxSize: number; allowedMimeTypes: string[]; allowedExtensions: string[] }> = {
  "resume-assets": {
    maxSize: 5 * 1024 * 1024,
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
  },
  "project-images": {
    maxSize: 3 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp"],
  },
  "og-images": {
    maxSize: 2 * 1024 * 1024,
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp"],
  },
  "private-uploads": {
    maxSize: 5 * 1024 * 1024,
    allowedMimeTypes: ["application/pdf", "image/png", "image/jpeg", "image/webp"],
    allowedExtensions: [".pdf", ".png", ".jpg", ".jpeg", ".webp"],
  },
};

export async function POST(request: NextRequest) {
  let uploadedPath: string | null = null;
  let targetBucket: string | null = null;

  try {
    const user = await verifyAdminSession();

    // IP-based rate limiting for upload route: max 10 uploads per 10 minutes per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const withinLimit = await verifyRateLimit(ip, "admin_upload", 10, 600000);
    if (!withinLimit) {
      return NextResponse.json({ error: "Too many uploads. Please try again in 10 minutes." }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const pathInput = formData.get("path") as string | null;
    const projectId = formData.get("projectId") as string | null;
    const alt = formData.get("alt") as string | null;
    const isCover = formData.get("isCover") === "true" || formData.get("isCover") === "on";

    if (!file || !bucket || !pathInput) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    targetBucket = bucket;

    // 1. Validate bucket
    const config = BUCKET_CONFIGS[bucket];
    if (!config) {
      return NextResponse.json({ error: "Invalid bucket name" }, { status: 400 });
    }

    // 2. Validate file size
    if (file.size > config.maxSize) {
      const sizeMb = (config.maxSize / (1024 * 1024)).toFixed(0);
      return NextResponse.json({ error: `File exceeds the limit of ${sizeMb}MB for this bucket.` }, { status: 400 });
    }

    // 3. Validate MIME type
    if (!config.allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}. Allowed: ${config.allowedMimeTypes.join(", ")}` }, { status: 400 });
    }

    // 4. Validate extension
    const extMatch = pathInput.match(/\.[0-9a-z]+$/i);
    const ext = extMatch ? extMatch[0].toLowerCase() : "";
    if (!config.allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: `Invalid file extension: ${ext}. Allowed: ${config.allowedExtensions.join(", ")}` }, { status: 400 });
    }

    // 5. Validate path format (no traversal, only safe characters)
    if (pathInput.includes("..") || pathInput.includes("\\")) {
      return NextResponse.json({ error: "Path traversal is not allowed" }, { status: 400 });
    }
    const safePathRegex = /^[a-zA-Z0-9_\-\.\/]+$/;
    if (!safePathRegex.test(pathInput)) {
      return NextResponse.json({ error: "File path contains invalid characters. Only alphanumeric, hyphens, underscores, slashes, and periods are allowed." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();

    // Convert File to ArrayBuffer for uploading
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(pathInput, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      logger.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload file to storage." }, { status: 500 });
    }

    uploadedPath = uploadData.path;
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(uploadedPath);

    // 6. DB Updates & Transactional Cleanup on Failure
    try {
      if (bucket === "resume-assets") {
        // Update profile
        const profile = await prisma.profile.findFirst({
          orderBy: { createdAt: "desc" },
        });
        if (profile) {
          await prisma.profile.update({
            where: { id: profile.id },
            data: {
              resumeUrl: publicUrlData.publicUrl,
              resumePath: uploadedPath,
            },
          });
          logger.info(`[AUDIT_LOG] User: ${user.email} | Action: UPLOAD_RESUME | Resource: profile:${profile.id} | Details: Uploaded resume PDF to path ${uploadedPath}`);
        } else {
          throw new Error("No profile record found to link this resume to.");
        }
      } else if (bucket === "project-images") {
        if (!projectId) {
          throw new Error("Project ID is required to link project images.");
        }

        // Check if project exists
        const project = await prisma.project.findUnique({
          where: { id: projectId },
        });
        if (!project) {
          throw new Error("Target project does not exist.");
        }

        // If this is set as cover, unset other cover images for this project
        if (isCover) {
          await prisma.projectImage.updateMany({
            where: { projectId, isCover: true },
            data: { isCover: false },
          });
        }

        // Create ProjectImage record
        const img = await prisma.projectImage.create({
          data: {
            projectId,
            imageUrl: publicUrlData.publicUrl,
            imagePath: uploadedPath,
            alt: alt || `${project.title} screenshot`,
            isCover,
            isPublished: true,
          },
        });
        logger.info(`[AUDIT_LOG] User: ${user.email} | Action: UPLOAD_PROJECT_IMAGE | Resource: project_image:${img.id} | Details: Uploaded image to path ${uploadedPath} for project ${project.title}`);
      }
    } catch (dbError) {
      logger.error("Database update failed, rolling back uploaded storage file...", dbError);
      // Clean up orphaned storage file
      if (uploadedPath && targetBucket) {
        await supabase.storage.from(targetBucket).remove([uploadedPath]);
      }
      throw dbError; // Rethrow to main catch block
    }

    return NextResponse.json({
      success: true,
      path: uploadedPath,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during upload.";
    logger.error("Upload route error:", error);
    
    if (errorMessage === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (errorMessage === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

