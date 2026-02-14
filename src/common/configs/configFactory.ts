// src/common/configs/cors.ts
import type { CorsOptions } from "cors";
import { appConfig } from "./corsEnvConfig";

function safeOriginForLog(origin: string) {
  try {
    const u = new URL(origin);
    return `${u.protocol}//${u.host}`;
  } catch {
    return origin;
  }
}

export function buildCorsOptions(): CorsOptions {
  const { allowedOrigins, allowNoOrigin } = appConfig;

  return {
    origin: (origin, callback) => {
      // Requests like curl / Postman / server-to-server may have no Origin header
      if (!origin) {
        if (allowNoOrigin) return callback(null, true);
        return callback(new Error("CORS blocked: missing Origin header"));
      }

      const normalized = origin.trim().replace(/\/$/, "");

      if (allowedOrigins.has(normalized)) {
        return callback(null, true);
      }

      // Log a safe, minimal message
      console.warn("[CORS] Blocked origin:", safeOriginForLog(normalized));

      // Structured-ish error (the client will mostly just see CORS failure)
      return callback(new Error("CORS blocked: origin not allowed"));
    },

    credentials: true, // only if you use cookies/auth headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
