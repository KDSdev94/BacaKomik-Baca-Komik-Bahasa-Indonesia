import { api } from "./config";

// Response structure: { meta: {...}, data: { ...fields } }
// List endpoints:    { meta: {...}, data: { list: [...] } }

export async function fetchHome() {
  const { data } = await api.get("/home");
  return data.data; // { slider, popular_today, latest_update, colored, genres }
}

export async function fetchKomikDetail(slug) {
  const { data } = await api.get(`/komik/${slug}`);
  return data.data;
}

export async function fetchChapter(slug) {
  const { data } = await api.get(`/chapter/${slug}`);
  return data.data;
}

export async function fetchSearch(query) {
  const { data } = await api.get("/search", { params: { q: query } });
  // API returns: { data: { query, results: [...], pagination: {...} } }
  return data.data?.results || data.data?.list || data.data || [];
}

// Type: manga | manhwa | manhua
export async function fetchByType(type, page = 1) {
  const { data } = await api.get(`/${type}`, { params: { page } });
  return data.data; // Returns { list: [...], pagination: {...} }
}

export async function fetchByGenre(slug, page = 1) {
  const { data } = await api.get(`/genre/${slug}`, { params: { page } });
  // Returns { list: [...], pagination: { current_page, total_pages, has_next, has_prev, ... } }
  return data.data;
}


export async function fetchByTema(slug) {
  const { data } = await api.get(`/tema/${slug}`);
  return data.data?.list || data.data || [];
}

export async function fetchByKonten(slug) {
  const { data } = await api.get(`/konten/${slug}`);
  return data.data?.list || data.data || [];
}

export async function fetchByDemografis(slug) {
  const { data } = await api.get(`/demografis/${slug}`);
  return data.data?.list || data.data || [];
}

export async function fetchColored() {
  const { data } = await api.get("/colored");
  return data.data?.list || data.data || [];
}

export async function fetchLatestUpdate(page = 1) {
  const { data } = await api.get("/latest_update", { params: { page } });
  return data.data; // { list: [...], pagination: { current_page, total_pages, has_next, has_prev } }
}
