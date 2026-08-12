export async function getGeoFromIP(
  ip: string
): Promise<{ country: string; city: string } | null> {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
    return null;
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data.status === "success" && data.country) {
      return { country: data.country, city: data.city ?? "" };
    }

    return null;
  } catch {
    return null;
  }
}
