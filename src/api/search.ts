// src/api/search.ts

export type SearchType = "user" | "post" | "opportunity";

export interface SearchResult {
  type: SearchType;
  id: number;
  title: string;
  subtitle?: string;
  excerpt?: string;
  avatarUrl?: string;
  url?: string;
  createdAt?: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  page: number;
  pageSize: number;
  total: number;
  results: SearchResult[];
}

export interface SuggestResponse {
  query: string;
  users: string[];
  posts: string[];
  opportunities: string[];
}

const API = import.meta.env?.VITE_API_BASE ?? "";

// Always return a concrete map of strings → strings (no unions)
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function getSearchResults(
  q: string,
  types?: string,
  page = 0,
  pageSize = 20
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q,
    page: String(page),
    pageSize: String(pageSize),
  });
  if (types) params.set("types", types);

  const res = await fetch(`${API}/api/search?` + params.toString(), {
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getSuggestions(q: string): Promise<SuggestResponse> {
  const res = await fetch(`${API}/api/search/suggest?q=${encodeURIComponent(q)}`, {
    headers: buildHeaders(),
  });
  if (!res.ok) throw new Error("Suggest failed");
  return res.json();
}

// No default export. Keep named exports.
