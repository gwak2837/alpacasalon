import Image from 'next/image'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import PageHead from 'src/components/PageHead'
import Navigation from 'src/layouts/Navigation'
import { currentUser } from 'src/models/recoil'
import AlpacasalonText from 'src/svgs/alpacasalon-text.svg'
import styled from 'styled-components'

import { Slider } from './post/create'

const Sticky = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
  padding: 0.6rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > svg {
    width: 6rem;
    height: 100%;
    padding: 0.5rem;
  }
`

const SliderWithoutScollBar = styled(Slider)`
  scrollbar-color: transparent transparent;
  scrollbar-width: 0px;
  ::-webkit-scrollbar {
    height: 0;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border: none;
  }
`

const WhiteButton = styled.button`
  border: 1px solid #eee;
  border-radius: 5px;

  padding: 0.7rem;
`

const Frame16to10 = styled.li<{ background?: string }>`
  scroll-snap-align: center;

  aspect-ratio: 16 / 10;
  background: ${(p) => p.background ?? '#fff'};
  flex: 0 0 100%;
  position: relative;
`

export default function HomePage() {
  const router = useRouter()
  const { nickname } = useRecoilValue(currentUser)

  return (
    <PageHead>
      <Sticky>
        <AlpacasalonText />
        {!nickname && <WhiteButton onClick={() => router.push('/login')}>로그인</WhiteButton>}
      </Sticky>

      <SliderWithoutScollBar>
        <Frame16to10>
          <Image src="/images/banner.webp" alt="banner" layout="fill" objectFit="cover" />
        </Frame16to10>
        <Frame16to10>
          <Image src="/images/banner2.webp" alt="banner" layout="fill" objectFit="cover" />
        </Frame16to10>
        <Frame16to10 background="#E2D7EC">
          <Image src="/images/banner3.webp" alt="banner" layout="fill" objectFit="cover" />
        </Frame16to10>
        <Frame16to10>
          <Image src="/images/banner4.webp" alt="banner" layout="fill" objectFit="cover" />
        </Frame16to10>
      </SliderWithoutScollBar>

      <h2>👀 추천 Zoom 대화방</h2>

      <h2>🔥 지금 핫한 이야기</h2>
    </PageHead>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
