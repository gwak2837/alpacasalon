import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { memo } from 'react'
import { Post } from 'src/graphql/generated/types-and-hooks'
import { ALPACA_SALON_COLOR, ALPACA_SALON_GREY_COLOR, TABLET_MIN_WIDTH } from 'src/models/constants'
import { FlexContainerBetween, Skeleton } from 'src/styles'
import { stopPropagation } from 'src/utils'
import styled from 'styled-components'

import { BoldGreySpan, GreySpan, HorizontalBorder } from './FamousPostCard'

const Li = styled.li`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  padding: 1rem 0.65rem;
`

const PrimaryH4 = styled.h5<{ disabled?: boolean }>`
  color: ${(p) => (p.disabled ? ALPACA_SALON_GREY_COLOR : ALPACA_SALON_COLOR)};
  font-weight: 600;
`

const H4 = styled.h4`
  margin: 0.75rem 0 0.5rem;
`

const OneLineP = styled.p`
  line-height: 1.6rem;
  width: calc(100vw - 2.6rem);
  max-width: calc(${TABLET_MIN_WIDTH} - 2.6rem);

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const A = styled.a`
  font-size: 0.9rem;
`

const GridContainerGap = styled.div`
  display: grid;
  gap: 0.6rem;

  > div:first-child {
    margin-bottom: 0.1rem;
  }
`

export function PostLoadingCard() {
  return (
    <Li>
      <GridContainerGap>
        <Skeleton width="3rem" />
        <Skeleton />
        <Skeleton width="80%" />
      </GridContainerGap>

      <HorizontalBorder />

      <FlexContainerBetween>
        <Skeleton width="3.5rem" />

        <BoldGreySpan>
          댓글 <Skeleton width="1.5rem" inlineBlock />개
        </BoldGreySpan>
      </FlexContainerBetween>
    </Li>
  )
}

type Props = {
  post: Post
}

function PostCard({ post }: Props) {
  const authorNickname = post.user?.nickname ?? ''
  const router = useRouter()
  const contents = post.contents.split(/\n/) as string[]

  function goToPostDetailPage() {
    router.push(`/post/${post.id}`)
  }

  return (
    <Li onClick={goToPostDetailPage}>
      <Link href={`/@${authorNickname}`} passHref>
        <a onClick={stopPropagation} role="link" tabIndex={0}>
          <PrimaryH4 disabled={!authorNickname}>{authorNickname ?? '탈퇴한 사용자'}</PrimaryH4>
        </a>
      </Link>

      <H4>{post.title}</H4>

      <OneLineP>
        {contents[0]}{' '}
        {contents.length > 1 && (
          <Link href={`/post/${post.id}`} passHref>
            <A onClick={stopPropagation} role="link" tabIndex={0}>
              ...
            </A>
          </Link>
        )}
      </OneLineP>

      <HorizontalBorder />

      <FlexContainerBetween>
        <GreySpan>{new Date(post.creationTime).toLocaleString()}</GreySpan>
        <BoldGreySpan>댓글 {post.commentCount}개</BoldGreySpan>
      </FlexContainerBetween>
    </Li>
  )
}

export default memo(PostCard)
