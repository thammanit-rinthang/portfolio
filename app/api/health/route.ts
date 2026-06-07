import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "../../_lib/api/responses";
import { logger } from "../../_lib/logger";

export function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.INTERNAL_MONITORING_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      logger.warn(
        `[HEALTH_UNAUTHORIZED] Unauthorized access attempt to health from IP ${
          request.headers.get("x-forwarded-for") || "unknown"
        }`,
      );
      return errorResponse("UNAUTHORIZED", "Unauthorized", 401);
    }
  }

  return successResponse({
    status: "ok",
  });
}
