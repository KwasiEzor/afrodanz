function normalizeTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getRequiredAppUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!rawUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured");
  }

  try {
    return normalizeTrailingSlash(new URL(rawUrl).toString());
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be a valid absolute URL");
  }
}
