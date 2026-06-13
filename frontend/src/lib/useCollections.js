import { useEffect, useState } from "react";
import { api } from "./api.js";

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
        if (alive) setCollections(Array.isArray(d?.collections) ? d.collections : []);
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
