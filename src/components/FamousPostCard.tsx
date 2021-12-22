import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import { FlexContainerBetween, Skeleton } from 'src/styles'
import FlowerIcon from 'src/svgs/FlowerIcon'
import { stopPropagation } from 'src/utils'
import styled from 'styled-components'

const Li = styled.li`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  padding: 0.65rem;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
`

const Relative = styled.div`
  position: relative;
  width: min-content;
`

const WhiteNumber = styled.h3`
  color: #fff;
  font-size: 1.25rem;

  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const HorizontalBorder = styled.div`
  border-bottom: 1px solid #f6f6f6;
  margin: 0.7rem 0 0.8rem;
`

export const GreySpan = styled.span`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  font-size: 0.9rem;
`

export const BoldGreySpan = styled(GreySpan)`
  font-weight: 600;
  white-space: nowrap;
  align-items: center;

  display: flex;
  align-items: center;
  gap: 0.2rem;
`

const GridContainerGap = styled.div`
  display: grid;
  gap: 0.6rem;
`

const GridContainerGap2 = styled(GridContainerGap)`
  grid-template-columns: auto auto;
`

type Props = {
  famousPost: any
  index: number
}

export function FamousPostLoadingCard() {
  return (
    <Li>
      <GridContainer>
        <Relative>
          <Skeleton width="3.5rem" height="3.5rem" borderRadius="50%" />
        </Relative>
        <GridContainerGap>
          <Skeleton width="80%" />
          <Skeleton width="50%" />
        </GridContainerGap>
      </GridContainer>

      <HorizontalBorder />

      <FlexContainerBetween>
        <GridContainerGap2>
          <Skeleton width="2.5rem" />
          <Skeleton width="4.5rem" />
        </GridContainerGap2>

        <BoldGreySpan>
          댓글 <Skeleton width="1.5rem" inlineBlock />개
        </BoldGreySpan>
      </FlexContainerBetween>
    </Li>
  )
}

function FamousPostCard({ famousPost, index }: Props) {
  const authorNickname = famousPost.user.nickname ?? ''
  const router = useRouter()

  function goToPostDetailPage() {
    router.push(`/post/${famousPost.id}`)
  }

  return (
    <Li onClick={goToPostDetailPage}>
      <GridContainer>
        <Relative>
          <FlowerIcon highlight={index === 1} />
          <WhiteNumber>{index}</WhiteNumber>
        </Relative>
        <h4>{famousPost.title}</h4>
      </GridContainer>

      <HorizontalBorder />

      <FlexContainerBetween>
        <Link href={`/@${authorNickname}`} passHref>
          <a onClick={stopPropagation} role="link" tabIndex={0}>
            <GreySpan>
              {authorNickname ?? '탈퇴한 사용자'} ·{' '}
              {new Date(famousPost.creationTime).toLocaleDateString()}
            </GreySpan>
          </a>
        </Link>

        <BoldGreySpan>댓글 {famousPost.commentCount}개</BoldGreySpan>
      </FlexContainerBetween>
    </Li>
  )
}

export default FamousPostCard
