import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "komikindo_bookmarks";

function getBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmark() {
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((komik) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.slug === komik.slug)) return prev;
      return [...prev, { slug: komik.slug, title: komik.title, cover: komik.cover }];
    });
  }, []);

  const removeBookmark = useCallback((slug) => {
    setBookmarks((prev) => prev.filter((b) => b.slug !== slug));
  }, []);

  const isBookmarked = useCallback(
    (slug) => bookmarks.some((b) => b.slug === slug),
    [bookmarks]
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
