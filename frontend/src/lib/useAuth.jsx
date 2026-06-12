import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api.js";
import { configureMyList } from "./useMyList.js";
import { configureWatchHistory } from "./useWatchHistory.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // resolve the session once on mount
  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  // re-point My List + Continue Watching at the backend (or localStorage
  // for guests) whenever the signed-in user changes
  useEffect(() => {
    if (!ready) return;
    configureMyList(user);
    configureWatchHistory(user);
  }, [user, ready]);

  const signup = useCallback(async (email, name, password) => {
    const r = await api.post("/auth/signup", { email, name, password });
    setUser(r.user);
    return r.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    setUser(r.user);
    return r.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const r = await api.patch("/auth/me", patch);
    setUser(r.user);
    return r.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
