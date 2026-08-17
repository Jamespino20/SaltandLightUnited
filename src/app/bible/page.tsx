"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  CaretLeft,
  CaretRight,
  SpinnerGap,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { WaveTransition } from "@/components/sections/WaveTransition";

const API = "https://api.midvash.com/v1";

const TRANSLATIONS = [
  { id: "niv", name: "NIV", title: "New International Version", lang: "en" },
  { id: "esv", name: "ESV", title: "English Standard Version", lang: "en" },
  { id: "kjv", name: "KJV", title: "King James Version", lang: "en" },
  { id: "web", name: "WEB", title: "World English Bible", lang: "en" },
  { id: "asv", name: "ASV", title: "American Standard Version", lang: "en" },
  { id: "bbe", name: "BBE", title: "Bible in Basic English", lang: "en" },
  { id: "darby", name: "Darby", title: "Darby Bible", lang: "en" },
  { id: "bnb", name: "BNB", title: "Banal na Bibliya (Tagalog)", lang: "tl" },
];

const BOOKS = [
  { id: "genesis", name: "Genesis", chapters: 50, testament: "old" },
  { id: "exodus", name: "Exodus", chapters: 40, testament: "old" },
  { id: "leviticus", name: "Leviticus", chapters: 27, testament: "old" },
  { id: "numbers", name: "Numbers", chapters: 36, testament: "old" },
  { id: "deuteronomy", name: "Deuteronomy", chapters: 34, testament: "old" },
  { id: "joshua", name: "Joshua", chapters: 24, testament: "old" },
  { id: "judges", name: "Judges", chapters: 21, testament: "old" },
  { id: "ruth", name: "Ruth", chapters: 4, testament: "old" },
  { id: "1-samuel", name: "1 Samuel", chapters: 31, testament: "old" },
  { id: "2-samuel", name: "2 Samuel", chapters: 24, testament: "old" },
  { id: "1-kings", name: "1 Kings", chapters: 22, testament: "old" },
  { id: "2-kings", name: "2 Kings", chapters: 25, testament: "old" },
  { id: "1-chronicles", name: "1 Chronicles", chapters: 29, testament: "old" },
  { id: "2-chronicles", name: "2 Chronicles", chapters: 36, testament: "old" },
  { id: "ezra", name: "Ezra", chapters: 10, testament: "old" },
  { id: "nehemiah", name: "Nehemiah", chapters: 13, testament: "old" },
  { id: "esther", name: "Esther", chapters: 10, testament: "old" },
  { id: "job", name: "Job", chapters: 42, testament: "old" },
  { id: "psalms", name: "Psalms", chapters: 150, testament: "old" },
  { id: "proverbs", name: "Proverbs", chapters: 31, testament: "old" },
  { id: "ecclesiastes", name: "Ecclesiastes", chapters: 12, testament: "old" },
  { id: "song-of-solomon", name: "Song of Solomon", chapters: 8, testament: "old" },
  { id: "isaiah", name: "Isaiah", chapters: 66, testament: "old" },
  { id: "jeremiah", name: "Jeremiah", chapters: 52, testament: "old" },
  { id: "lamentations", name: "Lamentations", chapters: 5, testament: "old" },
  { id: "ezekiel", name: "Ezekiel", chapters: 48, testament: "old" },
  { id: "daniel", name: "Daniel", chapters: 12, testament: "old" },
  { id: "hosea", name: "Hosea", chapters: 14, testament: "old" },
  { id: "joel", name: "Joel", chapters: 3, testament: "old" },
  { id: "amos", name: "Amos", chapters: 9, testament: "old" },
  { id: "obadiah", name: "Obadiah", chapters: 1, testament: "old" },
  { id: "jonah", name: "Jonah", chapters: 4, testament: "old" },
  { id: "micah", name: "Micah", chapters: 7, testament: "old" },
  { id: "nahum", name: "Nahum", chapters: 3, testament: "old" },
  { id: "habakkuk", name: "Habakkuk", chapters: 3, testament: "old" },
  { id: "zephaniah", name: "Zephaniah", chapters: 3, testament: "old" },
  { id: "haggai", name: "Haggai", chapters: 2, testament: "old" },
  { id: "zechariah", name: "Zechariah", chapters: 14, testament: "old" },
  { id: "malachi", name: "Malachi", chapters: 4, testament: "old" },
  { id: "matthew", name: "Matthew", chapters: 28, testament: "new" },
  { id: "mark", name: "Mark", chapters: 16, testament: "new" },
  { id: "luke", name: "Luke", chapters: 24, testament: "new" },
  { id: "john", name: "John", chapters: 21, testament: "new" },
  { id: "acts", name: "Acts", chapters: 28, testament: "new" },
  { id: "romans", name: "Romans", chapters: 16, testament: "new" },
  { id: "1-corinthians", name: "1 Corinthians", chapters: 16, testament: "new" },
  { id: "2-corinthians", name: "2 Corinthians", chapters: 13, testament: "new" },
  { id: "galatians", name: "Galatians", chapters: 6, testament: "new" },
  { id: "ephesians", name: "Ephesians", chapters: 6, testament: "new" },
  { id: "philippians", name: "Philippians", chapters: 4, testament: "new" },
  { id: "colossians", name: "Colossians", chapters: 4, testament: "new" },
  { id: "1-thessalonians", name: "1 Thessalonians", chapters: 5, testament: "new" },
  { id: "2-thessalonians", name: "2 Thessalonians", chapters: 3, testament: "new" },
  { id: "1-timothy", name: "1 Timothy", chapters: 6, testament: "new" },
  { id: "2-timothy", name: "2 Timothy", chapters: 4, testament: "new" },
  { id: "titus", name: "Titus", chapters: 3, testament: "new" },
  { id: "philemon", name: "Philemon", chapters: 1, testament: "new" },
  { id: "hebrews", name: "Hebrews", chapters: 13, testament: "new" },
  { id: "james", name: "James", chapters: 5, testament: "new" },
  { id: "1-peter", name: "1 Peter", chapters: 5, testament: "new" },
  { id: "2-peter", name: "2 Peter", chapters: 3, testament: "new" },
  { id: "1-john", name: "1 John", chapters: 5, testament: "new" },
  { id: "2-john", name: "2 John", chapters: 1, testament: "new" },
  { id: "3-john", name: "3 John", chapters: 1, testament: "new" },
  { id: "jude", name: "Jude", chapters: 1, testament: "new" },
  { id: "revelation", name: "Revelation", chapters: 22, testament: "new" },
];

interface VerseData {
  verse: number;
  text: string;
}

interface PassageData {
  reference: string;
  verses: VerseData[];
  translation: string;
}

export default function BiblePage() {
  const t = useTranslations("bible");
  const [translation, setTranslation] = useState("niv");
  const [selectedBook, setSelectedBook] = useState("john");
  const [chapter, setChapter] = useState(3);
  const [verseStart, setVerseStart] = useState<number | null>(null);
  const [verseEnd, setVerseEnd] = useState<number | null>(null);
  const [passage, setPassage] = useState<PassageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [customRef, setCustomRef] = useState("");

  const currentBook = BOOKS.find((b) => b.id === selectedBook);
  const [maxVerse, setMaxVerse] = useState(50);

  async function fetchPassage() {
    setLoading(true);
    try {
      let url: string;
      if (customRef.trim()) {
        const parsed = await fetch(
          `${API}/parse?q=${encodeURIComponent(customRef.trim())}`
        );
        const parsedData = await parsed.json();
        if (parsedData.data) {
          const d = parsedData.data;
          url = `${API}/${translation}/${d.book_slug}/${d.chapter}${d.verse_start ? `/${d.verse_start}${d.verse_end && d.verse_end !== d.verse_start ? `-${d.verse_end}` : ""}` : ""}`;
        } else {
          throw new Error("Could not parse reference");
        }
      } else if (verseStart !== null && verseEnd !== null && verseEnd !== verseStart) {
        url = `${API}/${translation}/${selectedBook}/${chapter}/${verseStart}-${verseEnd}`;
      } else if (verseStart !== null) {
        url = `${API}/${translation}/${selectedBook}/${chapter}/${verseStart}`;
      } else {
        url = `${API}/${translation}/${selectedBook}/${chapter}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Passage not found");
      const data = await res.json();
      if (!data.data) throw new Error("No data");

      const d = data.data;
      const meta = data.meta;
      const verses: VerseData[] = [];

      if (d.verses && Array.isArray(d.verses)) {
        d.verses.forEach((text: string, i: number) => {
          verses.push({
            verse: (d.verse || 1) + i,
            text: text.trim(),
          });
        });
      } else if (d.text) {
        verses.push({ verse: d.verse || 1, text: d.text.trim() });
      }

      const bookName = currentBook?.name || d.bookName || selectedBook;
      const refDisplay = meta?.reference || d.reference || customRef || `${bookName} ${chapter}`;
      const verseCount = meta?.total || d.verses?.length || verses.length;
      setMaxVerse(Math.max(verseCount + 5, 50));

      setPassage({
        reference: refDisplay,
        verses,
        translation: TRANSLATIONS.find((t) => t.id === translation)?.name || translation,
      });
    } catch {
      setPassage(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!customRef.trim()) {
      fetchPassage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, chapter, translation, verseStart, verseEnd]);

  function prevChapter() {
    setVerseStart(null);
    setVerseEnd(null);
    if (chapter > 1) {
      setChapter(chapter - 1);
    } else {
      const idx = BOOKS.findIndex((b) => b.id === selectedBook);
      if (idx > 0) {
        setSelectedBook(BOOKS[idx - 1].id);
        setChapter(BOOKS[idx - 1].chapters);
      }
    }
  }

  function nextChapter() {
    setVerseStart(null);
    setVerseEnd(null);
    if (currentBook && chapter < currentBook.chapters) {
      setChapter(chapter + 1);
    } else {
      const idx = BOOKS.findIndex((b) => b.id === selectedBook);
      if (idx < BOOKS.length - 1) {
        setSelectedBook(BOOKS[idx + 1].id);
        setChapter(1);
      }
    }
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0A0A0A]">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-slu-blue/30 blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <WaveTransition from="dark" to="light" />

      <section className="bg-[#F0F0F0] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slu-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Translation */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slu-black">
                  {t("selectVersion")}
                </label>
                <select
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  className="w-full rounded-xl border border-slu-gray-200 bg-[#F0F0F0] px-3 py-2.5 text-sm text-slu-black focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                >
                  {TRANSLATIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} - {v.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slu-black">
                  {t("selectBook")}
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => {
                    setSelectedBook(e.target.value);
                    setChapter(1);
                    setVerseStart(null);
                    setVerseEnd(null);
                  }}
                  className="w-full rounded-xl border border-slu-gray-200 bg-[#F0F0F0] px-3 py-2.5 text-sm text-slu-black focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
                >
                  <optgroup label="Old Testament">
                    {BOOKS.filter((b) => b.testament === "old").map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="New Testament">
                    {BOOKS.filter((b) => b.testament === "new").map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Chapter */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slu-black">
                  {t("selectChapter")}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevChapter}
                    className="rounded-lg border border-slu-gray-200 p-2 text-slu-gray-500 hover:bg-slu-gray-100"
                  >
                    <CaretLeft size={16} />
                  </button>
                  <span className="min-w-[3rem] text-center text-sm font-semibold text-slu-black">
                    {chapter}
                  </span>
                  <button
                    type="button"
                    onClick={nextChapter}
                    className="rounded-lg border border-slu-gray-200 p-2 text-slu-gray-500 hover:bg-slu-gray-100"
                  >
                    <CaretRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Verse range picker */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setVerseStart(null); setVerseEnd(null); }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    verseStart === null
                      ? "bg-slu-blue text-white"
                      : "bg-slu-gray-100 text-slu-gray-600 hover:bg-slu-gray-200"
                  }`}
                >
                  Full Chapter
                </button>
                <select
                  value={verseStart ?? ""}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : null;
                    setVerseStart(v);
                    if (v !== null && (verseEnd === null || verseEnd < v)) {
                      setVerseEnd(v);
                    }
                  }}
                  className="rounded-lg border border-slu-gray-200 bg-[#F0F0F0] px-2 py-1.5 text-xs text-slu-black focus:border-slu-blue focus:outline-none"
                >
                  <option value="">From</option>
                  {Array.from({ length: maxVerse }, (_, i) => i + 1).map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <span className="text-xs text-slu-gray-400">to</span>
                <select
                  value={verseEnd ?? ""}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : null;
                    setVerseEnd(v);
                  }}
                  className="rounded-lg border border-slu-gray-200 bg-[#F0F0F0] px-2 py-1.5 text-xs text-slu-black focus:border-slu-blue focus:outline-none"
                >
                  <option value="">To</option>
                  {Array.from({ length: maxVerse }, (_, i) => i + 1)
                    .filter((v) => verseStart === null || v >= verseStart)
                    .map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Custom reference input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={customRef}
                onChange={(e) => setCustomRef(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchPassage()}
                placeholder={t("enterReference") || "e.g. john 3:16-18, psalm 23"}
                className="flex-1 rounded-xl border border-slu-gray-200 bg-[#F0F0F0] px-4 py-2.5 text-sm text-slu-black placeholder:text-slu-gray-400 focus:border-slu-blue focus:outline-none focus:ring-2 focus:ring-slu-blue/20"
              />
              <button
                type="button"
                onClick={fetchPassage}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-slu-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slu-blue-dark disabled:opacity-50"
              >
                {loading ? (
                  <SpinnerGap size={16} className="animate-spin" />
                ) : (
                  <MagnifyingGlass size={16} />
                )}
                {t("read") || "Read"}
              </button>
            </div>
          </div>

          {/* Passage display */}
          <div className="mt-6 rounded-2xl border border-slu-gray-200 bg-white p-8 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-slu-gray-500">
                <SpinnerGap size={20} className="animate-spin" />
                {t("loadingPassage") || "Loading..."}
              </div>
            ) : passage && passage.verses.length > 0 ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slu-black">
                    {passage.reference}
                  </h2>
                  <span className="rounded-full bg-slu-blue/10 px-3 py-1 text-xs font-semibold text-slu-blue">
                    {passage.translation}
                  </span>
                </div>
                <div className="space-y-1">
                  {passage.verses.map((verse) => (
                    <p key={verse.verse} className="text-base leading-relaxed text-slu-gray-700">
                      <sup className="mr-1 text-xs font-bold text-slu-blue">
                        {verse.verse}
                      </sup>
                      {verse.text}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slu-blue/10 text-slu-blue">
                  <BookOpen size={28} />
                </div>
                <p className="font-semibold text-slu-black">
                  {t("noPassage") || "Select a book and chapter to start reading."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
