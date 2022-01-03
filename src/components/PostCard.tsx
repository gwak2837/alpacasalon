import Image from 'next/image'
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

const FlexCenter = styled.div`
  display: flex;
  align-items: center;

  gap: 0.6rem;
`

const Width = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  position: relative;
  cursor: pointer;

  > span {
    border-radius: 50%;
  }
`

const H5 = styled.h5<{ disabled?: boolean }>`
  color: ${(p) => (p.disabled ? ALPACA_SALON_GREY_COLOR : '#000')};
  transition: all 0.3s ease-out;
  display: inline;
`

const InlineH5 = styled.h5`
  display: inline;
`

const H4 = styled.h4`
  margin: 0.75rem 0 0.5rem;
`

const Span = styled.span`
  cursor: pointer;
  color: ${ALPACA_SALON_COLOR};
`

const OneLineP = styled.p`
  line-height: 1.6rem;
  width: calc(100vw - 2.6rem);
  max-width: calc(${TABLET_MIN_WIDTH} - 2.6rem);

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  const author = post.user
  const router = useRouter()
  const contents = post.contents.split(/\n/) as string[]

  function goToPostDetailPage() {
    router.push(`/post/${post.id}`)
  }

  function goToUserPage(e: any) {
    if (author) {
      e.stopPropagation()
      router.push(`/@${author.nickname}`)
    }
  }

  return (
    <Li onClick={goToPostDetailPage}>
      <FlexCenter>
        {author && (
          <Width>
            <Image
              src={author?.imageUrl ?? '/images/default-profile-image.webp'}
              alt="profile image"
              layout="fill"
              objectFit="cover"
              onClick={goToUserPage}
            />
          </Width>
        )}
        <div>
          {author ? (
            <Link href={`/@${author.nickname}`} passHref>
              <a onClick={stopPropagation} role="link" tabIndex={0}>
                <H5>{author.nickname}</H5>
              </a>
            </Link>
          ) : (
            <H5 disabled onClick={stopPropagation} role="link" tabIndex={0}>
              탈퇴한 사용자
            </H5>
          )}
          {post.group && (
            <>
              <span>&nbsp;-&nbsp;</span>
              <Link href={`/group/${post.group.id}`} passHref>
                <a onClick={stopPropagation} role="link" tabIndex={0}>
                  <InlineH5>{post.group.name}</InlineH5>
                </a>
              </Link>
            </>
          )}
        </div>
      </FlexCenter>

      <H4>{post.title}</H4>

      <OneLineP>
        {contents[0]} {contents.length > 1 && <Span>...</Span>}
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
