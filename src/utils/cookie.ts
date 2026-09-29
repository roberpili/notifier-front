export function extractTokenFromSetCookie(headers: Headers): string | null {
  const setCookies =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : [headers.get("set-cookie")].filter(Boolean);

  for (const raw of setCookies) {
    if (!raw) continue;
    const match = raw.match(/(?:^|,)\s*session_token=([^;]+)/i);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}
