import { useEffect, useState } from "react";
import { api } from "./api.js";

// Editorial style: a heading never ends in a period. The model occasionally
// returns a generated collection title with one, so strip it on read (covers
// freshly-generated and already-cached titles alike).
const trimTitle = (t) => (typeof t === "string" ? t.replace(/\s*\.+$/, "") : t);

// Reads the universal generated collections once. Degrades silently to an empty
// list on error — Home always has its static rails, so this is purely additive.
export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .get("/collections")
      .then((d) => {
        if (!alive) return;
        const list = Array.isArray(d?.collections) ? d.collections : [];
        setCollections(list.map((c) => ({ ...c, title: trimTitle(c.title) })));
      })
      .catch((e) => {
        if (alive) setError(e?.code || "error");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { collections, loading, error };
}
