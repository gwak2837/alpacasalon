import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import NotificationCard, { NotificationLoadingCard } from 'src/components/NotificationCard'
import PageHead from 'src/components/PageHead'
import { applyLineBreak } from 'src/components/ZoomCard'
import {
  NotificationType,
  useMyZoomsQuery,
  useNotificationsQuery,
  useReadNotificationsMutation,
  useUserByNicknameQuery,
} from 'src/graphql/generated/types-and-hooks'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import Navigation from 'src/layouts/Navigation'
import {
  ALPACA_SALON_BACKGROUND_COLOR,
  ALPACA_SALON_COLOR,
  TABLET_MIN_WIDTH,
} from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import HeartIcon from 'src/svgs/HeartIcon'
import SettingIcon from 'src/svgs/setting.svg'
import { getUserNickname } from 'src/utils'
import styled from 'styled-components'

const Background = styled.div`
  background-color: #fcfcfc;
  padding-bottom: 10px;
`

const GridContainerTemplate = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  grid-template-rows: 0.5fr 1fr;

  position: relative;

  > span {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    width: 100%; // for safari
    border-radius: 50%;
  }
`

const A = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 3rem;
  padding: 0.5rem;

  display: flex;

  > svg {
    width: 100%; // for safari
  }
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;

  width: fit-content;
  margin: 0 auto 1.7rem;
  padding: 0.6rem 1rem;
  background: ${ALPACA_SALON_BACKGROUND_COLOR};
  border-radius: 30px;
  border: 1px solid #e3e3e3;

  > svg {
    width: 1.4rem;
  }
`

const H3 = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 0.6rem;
`

export const FlexContainerColumnEnd = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const Nickname = styled.h2`
  margin: 1rem;
  text-align: center;
`

const PrimaryColorText = styled.h4`
  color: ${ALPACA_SALON_COLOR};
`

const ContentBox = styled.div`
  margin: 0 1.25rem;
`

const Slider = styled.ul`
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;

  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;

  > div {
    scroll-snap-align: center;
    flex: 0 0 70%;
  }
`

const ZoomContents = styled.div`
  position: relative;
`

const ZoomCard = styled.img`
  width: 90%;
  max-height: 12.5rem;
  margin: 10px 20px 20px 0;
  border-radius: 10px;
`

const ZoomStartTime = styled.p`
  position: absolute;
  top: 10%;
  left: 3%;
  padding: 5px 10px;
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  word-break: break-word;
  background-color: rgba(255, 255, 255, 0.5);
`

const ZoomText = styled.p`
  position: absolute;
  width: 80%;
  bottom: 20%;
  left: 5%;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  word-break: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Ul = styled.ul`
  display: grid;
  gap: 1rem;
`

const notificationLimit = 10
const description = '알파카의 정보를 알아보세요'

export default function UserPage() {
  const [hasMoreData, setHasMoreData] = useState(true)
  const isExecuted = useRef(false)
  const router = useRouter()
  const userNickname = getUserNickname(router)
  const { nickname } = useRecoilValue(currentUser)

  const { data } = useUserByNicknameQuery({
    fetchPolicy: 'cache-and-network',
    onError: toastApolloError,
    skip: !userNickname,
    variables: { nickname: userNickname },
  })

  const user = data?.userByNickname

  const { data: data3 } = useMyZoomsQuery({
    onError: toastApolloError,
    skip: !userNickname || nickname !== userNickname,
  })

  const myZooms = data3?.myZooms

  const { data: notificationData, loading: notificationLoading } = useNotificationsQuery({
    fetchPolicy: 'cache-and-network',
    onError: toastApolloError,
    skip: !userNickname || nickname !== userNickname,
  })

  const notifications = notificationData?.notifications
  const unreadNotificationIds = notifications
    ?.filter((notification) => !notification.isRead)
    .map((notification) => notification.id)

  const notificationInfiniteScrollRef = useInfiniteScroll({
    hasMoreData,
    onIntersecting: async () => {
      if (notifications && notifications.length > 0) {
        const lastNotifications = notifications[notifications.length - 1]
        setHasMoreData(false)
      }
    },
  })

  const [readNotifications] = useReadNotificationsMutation({
    onError: toastApolloError,
  })

  useEffect(() => {
    if (!isExecuted.current) {
      if (nickname === userNickname) {
        if (unreadNotificationIds && unreadNotificationIds?.length > 0) {
          readNotifications({ variables: { ids: unreadNotificationIds } })
          isExecuted.current = true
        }
      }
    }
  }, [nickname, readNotifications, unreadNotificationIds, userNickname])

  useNeedToLogin()

  return (
    <PageHead title={`@${userNickname} - 알파카살롱`} description={description}>
      <Background>
        <GridContainerTemplate>
          {nickname === userNickname && (
            <Link href={`${router.asPath}/setting`} passHref>
              <A>
                <SettingIcon />
              </A>
            </Link>
          )}
          <Image
            src={user?.imageUrl ?? '/images/default-profile-image.webp'}
            alt="profile-image"
            width="200"
            height="200"
            objectFit="cover"
          />
        </GridContainerTemplate>

        <Nickname>{user ? user.nickname : '로딩중'}</Nickname>

        <FlexContainer>
          <HeartIcon selected />
          받은 공감 개수
          <PrimaryColorText>{user?.likedCount ?? '-'}</PrimaryColorText>
        </FlexContainer>
        <ContentBox>
          <H3>내 ZOOM 대화방</H3>
          <Slider>
            {myZooms?.map((myZoom) => (
              <ZoomContents key={myZoom.id}>
                <ZoomCard src={myZoom.imageUrl} />
                <ZoomStartTime>오늘 오후 7시 예정</ZoomStartTime>
                <ZoomText>{applyLineBreak(myZoom.title)}</ZoomText>
              </ZoomContents>
            ))}
          </Slider>

          <H3>알림</H3>
          <Ul>
            {notifications
              ? notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))
              : !notificationLoading && <div>최신 이야기가 없어요</div>}
            {notificationLoading && (
              <>
                <NotificationLoadingCard />
                <NotificationLoadingCard />
              </>
            )}
          </Ul>
          {!notificationLoading && hasMoreData && (
            <div ref={notificationInfiniteScrollRef}>무한 스크롤</div>
          )}
          {!hasMoreData && <div>모든 알림을 불러왔어요</div>}
        </ContentBox>
      </Background>
    </PageHead>
  )
}

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
