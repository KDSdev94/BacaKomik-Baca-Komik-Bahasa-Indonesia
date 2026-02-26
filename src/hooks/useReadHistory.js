import { useCallback } from "react";

const STORAGE_KEY = "baca_komik_read_history";

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function useReadHistory() {
    // Catat chapter yang dibuka: { [komikSlug]: { lastRead: chapterSlug, readChapters: Set } }
    const markAsRead = useCallback((komikSlug, chapterSlug, chapterName) => {
        if (!komikSlug || !chapterSlug) return;
        const history = getHistory();
        const existing = history[komikSlug] || { lastRead: null, lastReadName: null, readChapters: [] };
        const readSet = new Set(existing.readChapters);
        readSet.add(chapterSlug);
        history[komikSlug] = {
            lastRead: chapterSlug,
            lastReadName: chapterName || chapterSlug,
            readChapters: Array.from(readSet),
        };
        saveHistory(history);
    }, []);

    const getKomikHistory = useCallback((komikSlug) => {
        const history = getHistory();
        const entry = history[komikSlug];
        if (!entry) return { lastRead: null, lastReadName: null, readChapters: new Set() };
        return {
            lastRead: entry.lastRead,
            lastReadName: entry.lastReadName,
            readChapters: new Set(entry.readChapters),
        };
    }, []);

    const isRead = useCallback((komikSlug, chapterSlug) => {
        const history = getHistory();
        const entry = history[komikSlug];
        if (!entry) return false;
        return entry.readChapters.includes(chapterSlug);
    }, []);

    return { markAsRead, getKomikHistory, isRead };
}
