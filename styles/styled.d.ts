import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    bright: {
      backgroundColor: string;
      textColor: string;
      textColor2: string;
      pointColor: string;
      pointColorDark: string;
    };
  }
}
