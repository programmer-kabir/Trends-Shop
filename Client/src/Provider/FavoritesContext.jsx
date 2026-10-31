import React, { createContext, useState, useEffect, useCallback } from "react";

// Create Context
export const FavoritesContext = createContext();

export const WISHLIST_KEY = "trends_wishlist";
export const LEGACY_KEY = "favoriteTShirt";

export const getStoredFavorites = () => {
  try {
    const raw =
      localStorage.getItem(WISHLIST_KEY) || localStorage.getItem(LEGACY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setStoredFavorites = (ids) => {
  const json = JSON.stringify(ids);
  localStorage.setItem(WISHLIST_KEY, json);
  localStorage.setItem(LEGACY_KEY, json); // backward compatibility
};

const FavoritesProvider = ({ children }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);

  const updateFavoriteCount = useCallback(() => {
    const ids = getStoredFavorites();
    setFavoritesCount(ids.length);
  }, []);

  // Load favorite count from localStorage on initial render
  useEffect(() => {
    updateFavoriteCount();

    const handleStorageChange = () => updateFavoriteCount();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [updateFavoriteCount]);

  return (
    <FavoritesContext.Provider
      value={{
        favoritesCount,
        favoriteTShirtCount: favoritesCount, // backward compatibility
        updateFavoriteCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
