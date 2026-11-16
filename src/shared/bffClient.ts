export const BFF_ORIGIN = import.meta.env.VITE_BFF_ORIGIN || "http://localhost:3001";

export async function fetchPlayback(body: Record<string, unknown>) {
  const res = await fetch(`${BFF_ORIGIN}/api/playback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "playback failed");
  return json as { fileUrl: string; token: string; siteId?: string };
}
