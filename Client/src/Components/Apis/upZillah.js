// District.js
import { useQuery } from "@tanstack/react-query";
import React from "react";

const upZillah = () => {
  const {
    refetch,
    data: upZillahs = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ["upZillahs"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_LOCALHOST_KEY}/upZillahs`
      );
      return res.json();
    },
  });

  return [upZillahs, refetch, loading];
};

export default upZillah;