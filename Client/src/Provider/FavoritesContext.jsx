import React, { createContext, useState, useEffect } from "react";

// Create Context
export const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const [favoriteTShirtCount, setFavoriteTShirtCount] = useState(0);

  // Load favorite count from localStorage on initial render
  useEffect(() => {
    const storedIdsString = localStorage.getItem("favoriteTShirt");
    const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
    setFavoriteTShirtCount(storedIds.length);
  }, []);

  // Function to update favorite count
  const updateFavoriteCount = () => {
    const storedIdsString = localStorage.getItem("favoriteTShirt");
    const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
    setFavoriteTShirtCount(storedIds.length);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteTShirtCount, updateFavoriteCount }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
