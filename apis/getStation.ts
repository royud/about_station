import { useQuery } from "react-query";

import axios from "axios";
import { useState } from "react";

export const useGetStationQuery = (inputValue: string) => {
  const [message, setMessage] = useState<string>("");
  const { refetch, data, isLoading } = useQuery({
    queryKey: ["getStation", inputValue],
    queryFn: async () => await axios.get(`/api/station/${inputValue}`),
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
    onSuccess: (data) => {
      setMessage(data.data.message);
    },
    onError: (error: any) => {
      setMessage(error.response.data.message);
    },
  });

  return { refetch, data, isLoading, message };
};
