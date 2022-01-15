/* eslint-disable react/no-danger */
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ALPACA_SALON_COLOR, APPLICATION_SHORT_NAME, CANONICAL_URL } from 'src/models/constants'
import { GOOGLE_ANALYTICS_ID } from 'src/utils/google-analytics'
import { ServerStyleSheet } from 'styled-components'

// 최대 10개
const keywords = `${APPLICATION_SHORT_NAME},중년,여성,위로,공감,커뮤니티`
const subject = '중년 여성 위로 공감 커뮤니티'

export default class AlpacaSalonDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&family=Roboto&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css"
          />
          <link rel="shortcut icon" href="/images/shortcut-icon.png" />
          <link rel="icon" href="/images/icon.png" />
          <link rel="canonical" href={CANONICAL_URL} />
          <link rel="manifest" href="manifest.json" />
          <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
          <link
            href="/images/iphone5_splash.webp"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/iphone6_splash.webp"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/iphonex_splash.webp"
            media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/iphoneplus_splash.webp"
            media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/iphonexr_splash.webp"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/iphonexsmax_splash.webp"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/ipad_splash.webp"
            media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/ipadpro1_splash.webp"
            media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/ipadpro3_splash.webp"
            media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/images/ipadpro2_splash.webp"
            media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <meta name="author" content="sindy" />
          <meta name="keywords" content={keywords} />
          <meta name="application-name" content={APPLICATION_SHORT_NAME} />
          <meta name="theme-color" content={ALPACA_SALON_COLOR} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content={APPLICATION_SHORT_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="generator" content="Next.js" />
          <meta name="subject" content={subject} />
          <meta name="rating" content="general" />
          <meta name="robots" content="index,follow" />
          <meta name="revisit-after" content="7 days" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GOOGLE_ANALYTICS_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
