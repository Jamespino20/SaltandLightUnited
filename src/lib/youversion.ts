const API = "https://api.midvash.com/v1";

export interface Verse {
  verse: number;
  text: string;
}

export interface PassageResult {
  reference: string;
  verses: Verse[];
  translation: string;
}

export async function fetchPassage(
  reference: string,
  translation: string = "kjv"
): Promise<PassageResult | null> {
  try {
    const parsed = await fetch(
      `${API}/parse?q=${encodeURIComponent(reference)}`
    );
    const parsedData = await parsed.json();
    if (!parsedData.data) return null;

    const d = parsedData.data;
    let url = `${API}/${translation}/${d.book_slug}/${d.chapter}`;
    if (d.verse_start) {
      url += `/${d.verse_start}`;
      if (d.verse_end && d.verse_end !== d.verse_start) {
        url += `-${d.verse_end}`;
      }
    }

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.data) return null;

    const result = data.data;
    const verses: Verse[] = [];

    if (result.verses && Array.isArray(result.verses)) {
      result.verses.forEach((text: string, i: number) => {
        verses.push({
          verse: (result.verse_start || 1) + i,
          text: text.trim(),
        });
      });
    } else if (result.text) {
      verses.push({ verse: result.verse_start || 1, text: result.text.trim() });
    }

    return {
      reference: result.reference || reference,
      verses,
      translation,
    };
  } catch {
    return null;
  }
}

export async function fetchVerseOfTheDay(): Promise<{
  content: string;
  reference: string;
} | null> {
  try {
    const res = await fetch(`${API}/votd?version=kjv`);
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.text || data.data?.text || "";
    const reference = data.reference || data.data?.reference || "";
    if (!text) return null;
    return { content: text, reference };
  } catch {
    return null;
  }
}
