const CSRF_COOKIE = "slu.csrf-token";
const CSRF_HEADER = "x-csrf-token";

export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function csrfFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = getCsrfToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set(CSRF_HEADER, token);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: "same-origin",
  });
}
