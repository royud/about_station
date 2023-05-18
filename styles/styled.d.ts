import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: {
      bright: string;
      dark: string;
    };
    backgroundColor: {
      bright: string;
      dark: string;
    };
  }
}
