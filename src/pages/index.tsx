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

  :hover > li > *,
  :focus-within > li > * {
    animation-name: none;
  }

  @keyframes toNext {
    75% {
      left: 0;
    }
    95% {
      left: 100%;
    }
    98% {
      left: 100%;
    }
    99% {
      left: 0;
    }
  }

  @keyframes toStart {
    75% {
      left: 0;
    }
    95% {
      left: -300%;
    }
    98% {
      left: -300%;
    }
    99% {
      left: 0;
    }
  }

  @keyframes snap {
    96% {
      scroll-snap-align: center;
    }
    97% {
      scroll-snap-align: none;
    }
    99% {
      scroll-snap-align: none;
    }
    100% {
      scroll-snap-align: center;
    }
  }
`

const WhiteButton = styled.button`
  border: 1px solid #eee;
  border-radius: 5px;

  padding: 0.7rem;
`

const Snap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  scroll-snap-align: center;

  animation-timing-function: ease;
  animation-duration: 4s;
  animation-iteration-count: infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-name: none;
  }
`

const SnapNext = styled(Snap)`
  animation-name: toNext, snap;
`

const SnapStart = styled(Snap)`
  animation-name: toStart, snap;
`

const Frame16to10 = styled.li<{ background?: string }>`
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
          <SnapNext />
          <Image src="/images/banner.webp" alt="banner" layout="fill" objectFit="cover" />
        </Frame16to10>
        <Frame16to10>
          <SnapNext />
          <Image src="/images/banner2.webp" alt="banner" layout="fill" objectFit="cover" />
        </Frame16to10>
        <Frame16to10 background="#E2D7EC">
          <SnapNext />
          <Image src="/images/banner3.webp" alt="banner" layout="fill" objectFit="cover" />
        </Frame16to10>
        <Frame16to10>
          <SnapStart />
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
