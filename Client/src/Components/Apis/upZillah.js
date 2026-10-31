import { useQuery } from "@tanstack/react-query";

const useUpZillah = () => {
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

export default useUpZillah;