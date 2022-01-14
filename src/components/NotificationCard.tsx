import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import { NotificationType } from 'src/graphql/generated/types-and-hooks'
import { TABLET_MIN_WIDTH } from 'src/models/constants'
import { Skeleton } from 'src/styles'
import CelebrateIcon from 'src/svgs/celebrate.svg'
import styled from 'styled-components'

interface INotification {
  bgColor?: string
}

const Li = styled.li<INotification>`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;

  padding: 1rem;
  border: 1px solid #f6f6f6;
  border-radius: 20px;
  background-color: ${(p) => p.bgColor ?? '#fff'};
`

const SquareFrame = styled.div`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
`

const Grid = styled.div`
  display: grid;
  gap: 0.3rem;

  width: calc(100vw - 7rem);
  max-width: calc(${TABLET_MIN_WIDTH} - 7rem);
`

const TextOverflowEllipsis = styled.div`
  color: ${(p) => p.color};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  > a {
    font-weight: 600;
  }
`

function getNotificationTypeFrom(notificationType: NotificationType) {
  switch (notificationType) {
    case NotificationType.LikingComment:
      return ' 회원님의 댓글에 공감해요'
    case NotificationType.NewComment:
      return ' 회원님의 댓글에 답글을 남겼어요'
    case NotificationType.NewSubcomment:
      return ' 회원님의 게시글에 댓글을 남겼어요'
    case NotificationType.HotPost:
      return '회원님의 게시물이 핫게시글에 올라갔어요'
    default:
      return '잘못된 Notification 형식입니다'
  }
}

export function NotificationLoadingCard() {
  return (
    <Li>
      <Skeleton width="2.2rem" height="2.2rem" borderRadius="50%" />
      <Grid>
        <Skeleton width="90%" />
        <Skeleton width="60%" />
      </Grid>
    </Li>
  )
}

type Props = {
  notification: any
}

function NotificationCard({ notification }: Props) {
  return (
    <Li key={notification.id} bgColor={notification.isRead ? 'white' : '#F5F2F8'}>
      <SquareFrame>
        {notification.type === NotificationType.HotPost ? (
          <CelebrateIcon />
        ) : (
          <Link href={`/@${notification.sender?.nickname}`} passHref>
            <a>
              <Image
                src={notification?.sender?.imageUrl ?? '/images/default-profile-image.webp'}
                alt={notification?.sender?.imageUrl}
                layout="fill"
                objectFit="cover"
              />
            </a>
          </Link>
        )}
      </SquareFrame>
      <Grid>
        <TextOverflowEllipsis color="black">
          {notification.type !== NotificationType.HotPost && (
            <>
              <Link href={`/@${notification.sender?.nickname}`} passHref>
                <a>{notification.sender?.nickname}</a>
              </Link>
              님이
            </>
          )}
          {getNotificationTypeFrom(notification.type)}
        </TextOverflowEllipsis>
        <TextOverflowEllipsis color="#787878">{notification.contents}</TextOverflowEllipsis>
      </Grid>
    </Li>
  )
}

export default memo(NotificationCard)
