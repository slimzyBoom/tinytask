// src/common/configs/env.ts
type AppEnv = "development" | "test" | "production";

const normalizeOrigin = (origin: string): string =>
  origin.trim().replace(/\/$/, "");

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function parseAllowedOrigins(
  raw: string | undefined,
  env: AppEnv,
): Set<string> {
  // Defaults by mode
  if (!raw || raw.trim() === "") {
    if (env === "development" || env === "test") {
      const defaults = ["http://localhost:3000", "http://127.0.0.1:3000"].map(
        normalizeOrigin,
      );
      return new Set(defaults);
    }

    // Production: fail fast
    throw new Error(
      "Missing CORS_ALLOWED_ORIGINS in production.",
    );
  }

  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const normalized = parts.map(normalizeOrigin);

  const invalid = normalized.filter((o) => !isValidHttpUrl(o));
  if (invalid.length > 0) {
    throw new Error(
      `Invalid URL(s) in CORS_ALLOWED_ORIGINS: ${invalid.join(", ")}`,
    );
  }

  return new Set(normalized);
}

const env = (process.env.NODE_ENV ?? "development") as AppEnv;

export const appConfig = {
  allowedOrigins: parseAllowedOrigins(process.env.CORS_ALLOWED_ORIGINS, env),
  allowNoOrigin: true, // set false if you don't want curl/server-to-server without Origin
};
