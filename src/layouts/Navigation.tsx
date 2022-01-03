import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import {
  ALPACA_SALON_COLOR,
  ALPACA_SALON_GREY_COLOR,
  NAVIGATION_HEIGHT,
} from 'src/models/constants'
import { TABLET_MIN_WIDTH } from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import ChatIcon from 'src/svgs/ChatIcon'
import HomeIcon from 'src/svgs/HomeIcon'
import PersonIcon from 'src/svgs/PersonIcon'
import ZoomIcon from 'src/svgs/ZoomIcon'
import styled from 'styled-components'

const Padding = styled.div`
  padding-top: ${NAVIGATION_HEIGHT};
`

const FixedNavigation = styled.nav`
  position: fixed;
  bottom: 0;
  z-index: 1;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  align-items: center;

  width: 100%;
  max-width: ${TABLET_MIN_WIDTH};
  height: ${NAVIGATION_HEIGHT};
  box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.06);
  background-color: #fff;
`

const A = styled.a<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;

  width: 100%;
  height: 100%;
  color: ${(p) => (p.selected ? ALPACA_SALON_COLOR : ALPACA_SALON_GREY_COLOR)};
  font-size: 0.9rem;

  * {
    transition: all 0.3s ease-out;
  }

  svg {
    width: 1.5rem;
  }
`

const StrokeA = styled(A)`
  :focus,
  :hover {
    color: ${ALPACA_SALON_COLOR};

    * {
      stroke: ${ALPACA_SALON_COLOR};
    }
  }
`

const FillA = styled(A)`
  :focus,
  :hover {
    color: ${ALPACA_SALON_COLOR};

    * {
      fill: ${ALPACA_SALON_COLOR};
    }
  }
`

const H4 = styled.h4`
  font-size: 0.9rem;
`

type Props = {
  children: ReactNode
}

function Navigation({ children }: Props) {
  const { asPath } = useRouter()
  const { nickname, hasNewNotifications } = useRecoilValue(currentUser)

  const isHomePageSelected = asPath === '/'
  const isPostsPageSelected = asPath.startsWith('/post')
  const isZoomsPageSelected = asPath.startsWith('/zoom')
  const isMyPageSelected = asPath.startsWith(encodeURI(`/@${nickname}`))

  return (
    <>
      {children}
      <Padding />

      <FixedNavigation>
        <Link href="/" passHref>
          <FillA selected={isHomePageSelected}>
            <HomeIcon selected={isHomePageSelected} />
            <H4>홈</H4>
          </FillA>
        </Link>

        <Link href="/zoom" passHref>
          <FillA selected={isZoomsPageSelected}>
            <ZoomIcon selected={isZoomsPageSelected} />
            <H4>Zoom</H4>
          </FillA>
        </Link>

        <Link href="/post" passHref>
          <FillA selected={isPostsPageSelected}>
            <ChatIcon selected={isPostsPageSelected} />
            <H4>게시판</H4>
          </FillA>
        </Link>

        <Link href={`/@${nickname}`} passHref>
          <StrokeA selected={isMyPageSelected}>
            <PersonIcon hasNewNotifications={hasNewNotifications} selected={isMyPageSelected} />
            <H4>my알파카</H4>
          </StrokeA>
        </Link>
      </FixedNavigation>
    </>
  )
}

export default Navigation
