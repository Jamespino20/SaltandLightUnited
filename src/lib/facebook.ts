interface FacebookEmbed {
  html: string;
  width: number | null;
  height: number | null;
  title: string | null;
  author_name: string | null;
  thumbnail_url: string | null;
}

export async function getFacebookEmbed(url: string): Promise<FacebookEmbed> {
  const oembedUrl = `https://www.facebook.com/plugins/oembed_params/?url=${encodeURIComponent(url)}`;

  const res = await fetch(oembedUrl, {
    headers: { "User-Agent": "SaltAndLightUnited/1.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Facebook oEmbed failed: ${res.status}`);
  }

  return res.json();
}
