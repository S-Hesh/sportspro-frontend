import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSearchResults, type SearchResult } from "@/api/search";

function useQueryParam(name: string) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name) ?? "", [search, name]);
}

export default function SearchResultsPage() {
  const q = useQueryParam("q");
  const [tab, setTab] = useState<"all" | "users" | "posts" | "opportunities">("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => { setTab("all"); }, [q]);

  useEffect(() => {
    if (!q.trim()) { setResults([]); setTotal(0); return; }
    setLoading(true);
    const types = tab === "all" ? undefined : tab;
    getSearchResults(q, types)
      .then(r => { setResults(r.results); setTotal(r.total); })
      .finally(() => setLoading(false));
  }, [q, tab]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Search results for “{q}”</h1>

      <div className="flex gap-2 mb-4">
        {(["all","users","posts","opportunities"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full border text-sm ${tab===t ? "bg-black text-white" : "bg-white"}`}
          >
            {t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div>Loading…</div>}

      {!loading && (
        <>
          <div className="text-sm text-gray-500 mb-2">{total} results</div>
          <ul className="space-y-3">
            {results.map((r) => (
              <li key={`${r.type}-${r.id}`} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  {r.avatarUrl && <img src={r.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />}
                  <div className="flex-1">
                    <div className="text-xs uppercase text-gray-500">{r.type}</div>
                    <div className="font-medium">{r.title}</div>
                    {r.subtitle && <div className="text-gray-600">{r.subtitle}</div>}
                    {r.excerpt && <div className="text-gray-700 mt-1">{r.excerpt}</div>}
                    {/* If you later set r.url, you can render a link here */}
                  </div>
                </div>
              </li>
            ))}
            {!results.length && <div className="text-gray-600">No results. Try Users/Posts/Opportunities tabs.</div>}
          </ul>
        </>
      )}
    </div>
  );
}
