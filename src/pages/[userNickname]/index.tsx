import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import { useUserByNicknameQuery } from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import NavigationLayout from 'src/layouts/NavigationLayout'
import { ALPACA_SALON_BACKGROUND_COLOR, ALPACA_SALON_COLOR } from 'src/models/constants'
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
    cursor: pointer;
  }
`

const A = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;

  display: flex;

  width: 1.5rem;
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
  const router = useRouter()
  const userNickname = getUserNickname(router)

  const { data } = useUserByNicknameQuery({
    onError: toastApolloError,
    skip: !userNickname,
    variables: { nickname: userNickname },
  })

  const user = data?.userByNickname

  useNeedToLogin()

  return (
    <PageHead title={`@${userNickname} - 알파카살롱`} description={description}>
      <GridContainerTemplate>
        <Link href={`${router.asPath}/setting`} passHref>
          <A>
            <SettingIcon />
          </A>
        </Link>
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
    </PageHead>
  )
}

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
