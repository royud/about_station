import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  box-sizing: content-box;
  html {
    box-sizing: content-box;
    font-size: 15px;
  }
  ul, ol, li {
    list-style: none;
    padding: 0; margin: 0;
  }
  body {
    padding: 0;
    margin: 0;
  }
  h1 {
    margin: 0;
    font-size: 15px;
    font-weight: normal;
  }
`;
