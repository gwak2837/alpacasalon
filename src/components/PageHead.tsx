import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { APPLICATION_NAME, CANONICAL_URL } from 'src/models/constants'

type Props = {
  children: ReactNode
  title?: string // 최소 10자 ~ 최대 70자
  description?: string // 최소 70자 ~ 최대 320자
}

export default function PageHead({
  children,
  title = APPLICATION_NAME,
  description = '알파카살롱은 X세대가 모여서 자유롭게 자신의 이야기를 하면서 놀 수 있는 공간입니다.',
}: Props) {
  const { pathname } = useRouter()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/images/og-image.webp" />
        <meta property="og:image:alt" content="/images/og-image.webp" />
        <meta property="og:url" content={`${CANONICAL_URL}${pathname}`} />
        <meta property="og:site_name" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image:alt" content="Alpaca Logo" />
      </Head>
      {children}
    </>
  )
}
