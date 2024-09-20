import React from "react";
import { useQuery } from "@tanstack/react-query";

const Division = () => {
  const {
    refetch,
    data: divisions = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_LOCALHOST_KEY}/divisions`);
      return res.json();
    },
  });
  return [divisions, refetch, loading];
};

export default Division;