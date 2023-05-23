import { useQuery } from "react-query";

import axios from "axios";

export const useGetAutoCompleteQuery = (inputValue: string) => {
  const { data } = useQuery({
    queryKey: ["getAutoComplete", inputValue],
    queryFn: async () => await axios.get(`/api/autocomplete/${inputValue}`),
    enabled: !!inputValue,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return data;
};
