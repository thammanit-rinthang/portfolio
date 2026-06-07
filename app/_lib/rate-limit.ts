import "server-only";
import { prisma } from "./prisma";
import { logger } from "./logger";

// Fallback in-memory rate limiter map used if DB queries fail or are slow
const fallbackLimits = new Map<string, Record<string, { count: number; windowStart: number }>>();

const CRITICAL_ACTIONS = ["login", "admin_upload", "admin_mutation"];

/**
 * Fallback in-memory rate limit checker.
 */
function fallbackRateLimit(
  ipAddress: string,
  actionKey: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  let clientLimits = fallbackLimits.get(ipAddress);
  
  if (!clientLimits) {
    clientLimits = {};
    fallbackLimits.set(ipAddress, clientLimits);
  }

  const limit = clientLimits[actionKey];

  if (!limit) {
    clientLimits[actionKey] = { count: 1, windowStart: now };
    return true;
  }

  if (now - limit.windowStart > windowMs) {
    clientLimits[actionKey] = { count: 1, windowStart: now };
    return true;
  }

  if (limit.count >= maxRequests) {
    return false;
  }

  limit.count += 1;
  return true;
}

/**
 * Verifies if a given IP address is within the rate limit threshold for a specific action.
 * Utilizes PostgreSQL for a distributed, multi-instance rate limit record.
 * If the database rate limiter fails:
 * - Critical actions (login, admin_upload, admin_mutation) fail-safe (block requests).
 * - Non-critical actions fallback to local in-memory tracking with alert logging.
 * 
 * @param ipAddress Client IP address
 * @param actionKey Unique key representing the action (e.g. "chat", "login", "upload")
 * @param maxRequests Maximum number of allowed requests in the window
 * @param windowMs Window size in milliseconds
 * @returns Promise<boolean> true if under the limit, false if rate limited or blocked via fail-safe
 */
export async function verifyRateLimit(
  ipAddress: string,
  actionKey: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  try {
    const isAllowed = await prisma.$transaction(async (tx) => {
      // 1. Acquire transaction-level advisory lock for the (ipAddress, actionKey) pair.
      // We use hashtext on both to convert them into two 32-bit integers, matching pg_advisory_xact_lock(int, int).
      await tx.$executeRawUnsafe(
        `SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))`,
        ipAddress,
        actionKey
      );

      // 2. Atomic INSERT ... SELECT WHERE to record the request only if count is under the limit
      const affectedRows = await tx.$executeRawUnsafe(
        `INSERT INTO rate_limits (ip_address, action_key)
         SELECT $1, $2
         WHERE (
           SELECT COUNT(*)::text as count FROM rate_limits 
           WHERE ip_address = $1 AND action_key = $2 AND created_at >= $3
         ) < $4`,
        ipAddress,
        actionKey,
        windowStart,
        maxRequests
      );

      return affectedRows > 0;
    });

    if (!isAllowed) {
      logger.warn(`[RATE_LIMIT] Blocked IP: ${ipAddress} | Action: ${actionKey}`);
      return false;
    }

    // 4. Asynchronously prune old attempts to prevent table bloat (keep last 1 hour)
    const cleanupThreshold = new Date(now.getTime() - 3600000);
    prisma.$executeRawUnsafe(
      `DELETE FROM rate_limits WHERE created_at < $1`,
      cleanupThreshold
    ).catch((cleanupErr) => {
      logger.error("Failed to run rate limits cleanup:", cleanupErr);
    });

    return true;
  } catch (err) {
    // CRITICAL MONITORING ALERT
    logger.error(`[MONITORING_ALERT] Database rate limiter is offline or failed for IP ${ipAddress}, action ${actionKey}:`, err);

    // Fail-safe for critical endpoints
    if (CRITICAL_ACTIONS.includes(actionKey)) {
      logger.error(`[RATE_LIMIT_FAIL_SAFE] Blocking critical action "${actionKey}" from IP ${ipAddress} because database rate limiter is offline.`);
      return false;
    }

    // Fallback to local in-memory tracking for non-critical endpoints
    logger.warn(`[RATE_LIMIT_FALLBACK] Falling back to in-memory limiter for non-critical action "${actionKey}" from IP ${ipAddress}.`);
    return fallbackRateLimit(ipAddress, actionKey, maxRequests, windowMs);
  }
}

/**
 * Resets the rate limit counter for a specific IP and action.
 */
export async function resetRateLimit(ipAddress: string, actionKey: string): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      `DELETE FROM rate_limits WHERE ip_address = $1 AND action_key = $2`,
      ipAddress,
      actionKey
    );
  } catch (err) {
    logger.error(`[MONITORING_ALERT] Failed to reset DB rate limit for IP ${ipAddress}, action ${actionKey}:`, err);
  }

  // Also reset in fallback tracker
  const clientLimits = fallbackLimits.get(ipAddress);
  if (clientLimits && clientLimits[actionKey]) {
    delete clientLimits[actionKey];
  }
}
