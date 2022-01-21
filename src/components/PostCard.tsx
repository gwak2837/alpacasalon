import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { memo } from 'react'
import { Post } from 'src/graphql/generated/types-and-hooks'
import {
  ALPACA_SALON_COLOR,
  ALPACA_SALON_DARK_GREY_COLOR,
  ALPACA_SALON_GREY_COLOR,
  TABLET_MIN_WIDTH,
} from 'src/models/constants'
import { FlexContainerBetween, Skeleton } from 'src/styles'
import { stopPropagation } from 'src/utils'
import styled from 'styled-components'

const HorizontalBorder = styled.div`
  border-bottom: 1px solid #f6f6f6;
  margin: 0.7rem 0 0.8rem;
`

const GreySpan = styled.span`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  font-size: 0.9rem;
`

const BoldGreySpan = styled(GreySpan)`
  font-weight: 600;
  white-space: nowrap;
  align-items: center;

  display: flex;
  align-items: center;
  gap: 0.2rem;
`

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

export const SquareWidth = styled.div`
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
  > svg {
    width: 1rem;
    display: inline;
    vertical-align: middle;
  }
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
        <FlexCenter>
          <Skeleton width="2.25rem" height="2.25rem" borderRadius="50%" inlineBlock />
          <Skeleton width="3rem" inlineBlock />
          <Skeleton width="6rem" inlineBlock background="#fee" />
        </FlexCenter>
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

const Frame16to9 = styled.div<{ imageCount?: number }>`
  aspect-ratio: 16 / 9;
  position: relative;

  border-radius: 10px;
  overflow: hidden;
  margin: 0.6rem 0 0;

  display: grid;
  grid-template-rows: ${(p) => {
    switch (p.imageCount) {
      case 1:
      case 2:
        return '1fr'
      case 3:
      case 4:
      default:
        return '1fr 1fr'
    }
  }};
  grid-template-columns: ${(p) => {
    switch (p.imageCount) {
      case 1:
        return '1fr'
      case 2:
      case 3:
      case 4:
      default:
        return '1fr 1fr'
    }
  }};
  gap: 0.2rem;
`

function getImage(imageUrls: any[]) {
  switch (imageUrls.length) {
    case 0:
      return ''
    case 1:
      return (
        <Frame16to9>
          <Image src={imageUrls[0]} alt="profile image" layout="fill" objectFit="cover" />
        </Frame16to9>
      )
    case 2:
      return (
        <Frame16to9 imageCount={2}>
          <div style={{ gridColumn: '1 / 2', position: 'relative' }}>
            <Image src={imageUrls[0]} alt={imageUrls[0]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridColumn: '2 / 3', position: 'relative' }}>
            <Image src={imageUrls[1]} alt={imageUrls[1]} layout="fill" objectFit="cover" />
          </div>
        </Frame16to9>
      )
    case 3:
      return (
        <Frame16to9 imageCount={3}>
          <div style={{ gridRow: '1 / 3', gridColumn: '1 / 2', position: 'relative' }}>
            <Image src={imageUrls[0]} alt={imageUrls[0]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '1 / 2', gridColumn: '2 / 3', position: 'relative' }}>
            <Image src={imageUrls[1]} alt={imageUrls[1]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '2 / 3', gridColumn: '2 / 3', position: 'relative' }}>
            <Image src={imageUrls[2]} alt={imageUrls[2]} layout="fill" objectFit="cover" />
          </div>
        </Frame16to9>
      )
    case 4:
      return (
        <Frame16to9 imageCount={4}>
          <div style={{ gridRow: '1 / 2', gridColumn: '1 / 2', position: 'relative' }}>
            <Image src={imageUrls[0]} alt={imageUrls[0]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '2 / 3', gridColumn: '1 / 2', position: 'relative' }}>
            <Image src={imageUrls[1]} alt={imageUrls[1]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '1 / 2', gridColumn: '2 / 3', position: 'relative' }}>
            <Image src={imageUrls[2]} alt={imageUrls[2]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '2 / 3', gridColumn: '2 / 3', position: 'relative' }}>
            <Image src={imageUrls[3]} alt={imageUrls[3]} layout="fill" objectFit="cover" />
          </div>
        </Frame16to9>
      )
    default:
      return (
        <Frame16to9 imageCount={5}>
          <div style={{ gridRow: '1 / 2', gridColumn: '1 / 2', position: 'relative' }}>
            <Image src={imageUrls[0]} alt={imageUrls[0]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '2 / 3', gridColumn: '1 / 2', position: 'relative' }}>
            <Image src={imageUrls[1]} alt={imageUrls[1]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '1 / 2', gridColumn: '2 / 3', position: 'relative' }}>
            <Image src={imageUrls[2]} alt={imageUrls[2]} layout="fill" objectFit="cover" />
          </div>
          <div style={{ gridRow: '2 / 3', gridColumn: '2 / 3', position: 'relative' }}>
            <Image src={imageUrls[3]} alt={imageUrls[3]} layout="fill" objectFit="cover" />
          </div>
          <div
            style={{
              gridRow: '2 / 3',
              gridColumn: '2 / 3',
              position: 'relative',
              color: '#fff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#00000093',
            }}
          >
            + {imageUrls.length - 4}장
          </div>
        </Frame16to9>
      )
  }
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
          <SquareWidth>
            <Image
              src={author?.imageUrl ?? '/images/default-profile-image.webp'}
              alt="profile image"
              layout="fill"
              objectFit="cover"
              onClick={goToUserPage}
            />
          </SquareWidth>
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

      {post.imageUrls && getImage(post.imageUrls)}

      <HorizontalBorder />

      <FlexContainerBetween>
        <GreySpan>{new Date(post.creationTime).toLocaleString()}</GreySpan>
        <BoldGreySpan>댓글 {post.commentCount}개</BoldGreySpan>
      </FlexContainerBetween>
    </Li>
  )
}

export default memo(PostCard)
