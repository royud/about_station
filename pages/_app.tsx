import Head from "next/head";
import type { AppProps } from "next/app";

import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../styles/global-style";
import { darkTheme, lightTheme } from "@/styles/theme";

import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import useTheme from "@/hook/styleTheme";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const defaultValue = {
  theme: "light",
  changeTheme: () => {},
};

export const CustomThemeContext = React.createContext(defaultValue);

export default function App({ Component, pageProps }: AppProps) {
  const themeProps = useTheme();
  return (
    <QueryClientProvider client={client}>
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      <Head>
        <title>Toilet Gate</title>
      </Head>
      <GlobalStyle />
      <CustomThemeContext.Provider value={themeProps}>
        <ThemeProvider
          theme={themeProps.theme === "light" ? lightTheme : darkTheme}
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </CustomThemeContext.Provider>
    </QueryClientProvider>
  );
}
