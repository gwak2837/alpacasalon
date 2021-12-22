import 'react-toastify/dist/ReactToastify.min.css'
import 'src/styles/animate.css'
import 'normalize.css'
import 'src/styles/global.css'

import { ApolloProvider } from '@apollo/client'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactElement, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { ToastContainer, cssTransition } from 'react-toastify'
import { RecoilRoot } from 'recoil'
import { client } from 'src/apollo/client'
import Authentication from 'src/components/Authentication'
import { TABLET_MIN_WIDTH } from 'src/models/constants'
import { pageview } from 'src/utils/google-analytics'
import styled from 'styled-components'

const fade = cssTransition({
  enter: 'fadeIn',
  exit: 'fadeOut',
})

const Main = styled.main`
  max-width: ${TABLET_MIN_WIDTH};
  margin: 0 auto;
`

type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}

export default function AlpacaSalonApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout
  const router = useRouter()

  // Google Analytics 초기 설정
  useEffect(() => {
    const handleRouteChange = (url: string) => pageview(url)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Main>
        <ApolloProvider client={client}>
          <RecoilRoot>
            <Authentication>
              {getLayout ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} />}
            </Authentication>
          </RecoilRoot>
        </ApolloProvider>
      </Main>
      <ToastContainer autoClose={2000} hideProgressBar position="top-center" transition={fade} />
    </>
  )
}
