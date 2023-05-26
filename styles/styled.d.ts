import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      text_main: string;
      text_sub: string;
      border_point: string;
      border_sub: string;
      background_main: string;
      background_point: string;
    };
  }
}
