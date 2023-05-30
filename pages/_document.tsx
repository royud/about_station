import React from "react";
import Document, {
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document<any> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      // wraps the collectStyles provider around our <App />.
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      // extract the initial props that may be present.
      const initialProps = await Document.getInitialProps(ctx);

      // returning the original props together with our styled components.
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <html lang="ko">
        <Head>
          <meta property="og:title" content="Toilet Gate" />
          <meta property="og:description" content="빠른 지하철 화장실 찾기" />
          <meta property="og:image" content="/logo.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
