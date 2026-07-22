"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || cancelled) return;
      setCustomerId(user.id);
      const { data } = await supabase.from("favorites").select("professional_id").eq("customer_id", user.id);
      if (!cancelled && data) setFavoriteIds(new Set(data.map((r) => r.professional_id)));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleFavorite(id: string) {
    if (!customerId) return;
    const supabase = createClient();
    const wasFavorited = favoriteIds.has(id);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorited) next.delete(id);
      else next.add(id);
      return next;
    });

    if (wasFavorited) {
      await supabase.from("favorites").delete().eq("customer_id", customerId).eq("professional_id", id);
    } else {
      await supabase.from("favorites").insert({ customer_id: customerId, professional_id: id });
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite: (id) => favoriteIds.has(id), toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
