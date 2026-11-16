export function authApiUrl(path: string): string {
  return path;
}

export function backendApiUrl(path: string): string {
  const apiOrigin = process.env.BACKEND_API_URL ?? "http://localhost:4000";
  return new URL(path, apiOrigin).toString();
}
