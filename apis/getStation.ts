import { useQuery } from "react-query";

import axios from "axios";

export const useGetStationQuery = (inputValue: string) => {
  const { refetch, data, isLoading, error } = useQuery({
    queryKey: ["getStation", inputValue],
    queryFn: async () => await axios.get(`/api/station/${inputValue}`),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  return { refetch, data, isLoading, error };
};
