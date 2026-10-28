import React, { createContext, useEffect, useState } from "react";
export const WishListDataContext = createContext(null);

const WishlistData = ({ children }) => {
  const [favoriteTShirtCount, setFavoriteTShirtCount] = useState(0);
  useEffect(() => {
    const storedIdsString = localStorage.getItem("favoriteTShirt");
    if (storedIdsString) {
      const storedIds = JSON.parse(storedIdsString);
      setFavoriteTShirtCount(storedIds.length);
    } else {
      setFavoriteTShirtCount(0);
    }
  }, [setFavoriteTShirtCount]);
  const data = {
    favoriteTShirtCount,
    setFavoriteTShirtCount,
  };
  return (
    <WishListDataContext.Provider value={data}>
      {children}
    </WishListDataContext.Provider>
  );
};

export default WishlistData;
