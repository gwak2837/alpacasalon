import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ZoomReview } from 'src/graphql/generated/types-and-hooks'
import { H5 } from 'src/pages/post/[id]'
import { Skeleton } from 'src/styles'
import { stopPropagation } from 'src/utils'
import styled from 'styled-components'

import { SquareWidth } from './PostCard'

const Li = styled.li`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20px;
  overflow: auto;

  padding: 0.6rem;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export function ZoomReviewLoadingCard() {
  return (
    <Li>
      <Skeleton />
    </Li>
  )
}

type Props = {
  zoomReview: ZoomReview
}

function ZoomReviewCard({ zoomReview }: Props) {
  const writer = zoomReview.writer
  const router = useRouter()

  function goToPostDetailPage() {
    router.push(`/zoom/${zoomReview.id}`)
  }

  function goToUserPage(e: any) {
    if (writer) {
      e.stopPropagation()
      router.push(`/@${writer.nickname}`)
    }
  }

  return (
    <Li>
      {writer ? (
        <Flex>
          <SquareWidth>
            <Image
              src={writer?.imageUrl ?? '/images/default-profile-image.webp'}
              alt="profile image"
              layout="fill"
              objectFit="cover"
              onClick={goToUserPage}
            />
          </SquareWidth>
          <div>
            <Link href={`/@${writer.nickname}`} passHref>
              <a onClick={stopPropagation} role="link" tabIndex={0}>
                <H5>{writer.nickname}</H5>
              </a>
            </Link>
            {zoomReview.creationTime}
          </div>
        </Flex>
      ) : (
        <H5 disabled onClick={stopPropagation} role="link" tabIndex={0}>
          탈퇴한 사용자
        </H5>
      )}
      {zoomReview.contents}
    </Li>
  )
}

export default ZoomReviewCard
