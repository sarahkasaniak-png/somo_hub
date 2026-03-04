// src/app/context/FavoritesContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favoriteSessions: number[];
  favoriteTutors: number[];
  addFavorite: (type: "session" | "tutor", id: number) => void;
  removeFavorite: (type: "session" | "tutor", id: number) => void;
  toggleFavorite: (type: "session" | "tutor", id: number) => void;
  isFavorite: (type: "session" | "tutor", id: number) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const FAVORITES_STORAGE_KEY = "somohub_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favoriteSessions, setFavoriteSessions] = useState<number[]>([]);
  const [favoriteTutors, setFavoriteTutors] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoriteSessions(parsed.sessions || []);
        setFavoriteTutors(parsed.tutors || []);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify({
          sessions: favoriteSessions,
          tutors: favoriteTutors,
        }),
      );
    }
  }, [favoriteSessions, favoriteTutors, loading]);

  const addFavorite = (type: "session" | "tutor", id: number) => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    if (type === "session") {
      setFavoriteSessions((prev) => [...prev, id]);
    } else {
      setFavoriteTutors((prev) => [...prev, id]);
    }

    toast.success(
      `${type === "session" ? "Session" : "Tutor"} saved to favorites`,
    );
  };

  const removeFavorite = (type: "session" | "tutor", id: number) => {
    if (type === "session") {
      setFavoriteSessions((prev) =>
        prev.filter((sessionId) => sessionId !== id),
      );
    } else {
      setFavoriteTutors((prev) => prev.filter((tutorId) => tutorId !== id));
    }

    toast.success(`Removed from favorites`);
  };

  const toggleFavorite = (type: "session" | "tutor", id: number) => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }

    if (isFavorite(type, id)) {
      removeFavorite(type, id);
    } else {
      addFavorite(type, id);
    }
  };

  const isFavorite = (type: "session" | "tutor", id: number): boolean => {
    if (type === "session") {
      return favoriteSessions.includes(id);
    } else {
      return favoriteTutors.includes(id);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteSessions,
        favoriteTutors,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
