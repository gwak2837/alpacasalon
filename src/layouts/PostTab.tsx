import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { ALPACA_SALON_ACHROMATIC_COLOR, ALPACA_SALON_COLOR } from 'src/models/constants'
import styled from 'styled-components'

const Sticky = styled.div`
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;

  background: #fff;
  border-bottom: 1px solid #eee;
`

const A = styled.a<{ selected: boolean }>`
  display: grid;
  justify-content: center;
  align-items: center;
  margin: 2.25rem 2.25rem 0;
  padding: 0 0 0.75rem;

  border-bottom: ${(p) => (p.selected ? `3px solid ${ALPACA_SALON_COLOR}` : '3px solid #fff')};
  color: ${(p) => (p.selected ? ALPACA_SALON_COLOR : ALPACA_SALON_ACHROMATIC_COLOR)};
  transition: all 0.3s ease-out;

  :hover {
    color: ${ALPACA_SALON_COLOR};
  }
`

type Props = {
  children: ReactNode
}

export default function PostTab({ children }: Props) {
  const { asPath } = useRouter()

  const isFeedSelected = asPath === '/post'
  const isGroupSelected = asPath === '/group'

  return (
    <>
      <Sticky>
        <Link href="/post" passHref>
          <A selected={isFeedSelected}>피드</A>
        </Link>
        <Link href="/group" passHref>
          <A selected={isGroupSelected}>그룹</A>
        </Link>
      </Sticky>
      {children}
    </>
  )
}
