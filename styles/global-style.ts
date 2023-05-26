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
  body[data-theme='light']{
    /* text */
    --text-main: #000000;
    --text-sub: #ffffff;

    /* background */
    --bg-point: #9370db;
    --bg-main: #ffffff;

    /* border */
    --border-point: 2px solid #9370db;
  }
  body[data-theme='dark']{
    /* text */
    --text-main: #ffffff;
    --text-sub: #000000;

    /* background */
    --bg-point: #9370db;
    --bg-main: #000000;

    /* border */
    --border-point: 2px solid #9370db;
  }
  h1 {
    margin: 0;
    font-size: 15px;
    font-weight: normal;
  }
`;
