import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import {
  useNotificationsQuery,
  useReadNotificationsMutation,
  useUserByNicknameQuery,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import Navigation from 'src/layouts/Navigation'
import { ALPACA_SALON_BACKGROUND_COLOR, ALPACA_SALON_COLOR } from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import HeartIcon from 'src/svgs/HeartIcon'
import SettingIcon from 'src/svgs/setting.svg'
import { getUserNickname } from 'src/utils'
import styled from 'styled-components'

const GridContainerTemplate = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  grid-template-rows: 0.5fr 1fr;

  position: relative;

  > span {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    width: 100%; // for safari
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
  margin: 0 auto;
  padding: 1rem;
  background: ${ALPACA_SALON_BACKGROUND_COLOR};
  border-radius: 20px;

  > svg {
    width: 1.4rem;
  }
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

const description = '알파카의 정보를 알아보세요'

export default function UserPage() {
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

  const { data: data2 } = useNotificationsQuery({
    fetchPolicy: 'cache-and-network',
    onError: toastApolloError,
    skip: !userNickname || nickname !== userNickname,
  })

  const notifications = data2?.notifications
  const unreadNotificationIds = notifications
    ?.filter((notification) => !notification.isRead)
    .map((notification) => notification.id)

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
        />
      </GridContainerTemplate>

      <Nickname>{user ? user.nickname : '로딩중'}</Nickname>

      <FlexContainer>
        <HeartIcon selected />
        받은 공감 개수
        <PrimaryColorText>{user?.likedCount ?? '-'}</PrimaryColorText>
      </FlexContainer>

      <h3>내 ZOOM 대화</h3>

      <h3>알림</h3>

      {notifications?.map((notification) => (
        <pre key={notification.id} style={{ overflow: 'scroll' }}>
          {JSON.stringify(notification, null, 2)}
        </pre>
      ))}
    </PageHead>
  )
}

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
