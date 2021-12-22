import Image from 'next/image'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import { PrimaryButton, RedButton } from 'src/components/atoms/Button'
import PageHead from 'src/components/PageHead'
import {
  useLogoutMutation,
  useUnregisterMutation,
  useUserByNicknameQuery,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { ALPACA_SALON_BACKGROUND_COLOR, ALPACA_SALON_COLOR } from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import BackIcon from 'src/svgs/back-icon.svg'
import HeartIcon from 'src/svgs/HeartIcon'
import { getUserNickname } from 'src/utils'
import styled from 'styled-components'

const FlexContainerHeight100 = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;

  > :last-child {
    flex-grow: 1;
  }
`

const TitleIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  margin: 1rem;
  cursor: pointer;

  > svg {
    width: 1.5rem;
  }
`

const GridContainerTemplate = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  grid-template-rows: 0.5fr 1fr;

  > span {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    width: 100%; // for safari
    cursor: pointer;
  }
`

const GridContainerButtons = styled.div`
  display: grid;
  gap: 1rem;

  padding: 2rem 0.5rem;
`

const Wrapper = styled.div`
  width: 1.4rem;
  display: flex;
  align-items: center;

  svg {
    width: 100%; // for Safari
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
  const [{ nickname }, setCurrentUser] = useRecoilState(currentUser)

  const { data } = useUserByNicknameQuery({
    onError: toastApolloError,
    skip: !userNickname,
    variables: { nickname: userNickname },
  })

  const user = data?.userByNickname

  const [logoutMutation, { loading: logoutLoading }] = useLogoutMutation({
    onCompleted: ({ logout }) => {
      if (logout) {
        toast.success('로그아웃에 성공했어요')
        sessionStorage.removeItem('jwt')
        localStorage.removeItem('jwt')
        setCurrentUser({ nickname: '' })
        router.replace('/')
      }
    },
    onError: toastApolloError,
  })

  const [unregisterMutation, { loading: unregisterLoading }] = useUnregisterMutation({
    onCompleted: ({ unregister }) => {
      if (unregister) {
        toast.success('회원탈퇴에 성공했어요')
        sessionStorage.removeItem('jwt')
        localStorage.removeItem('jwt')
        setCurrentUser({ nickname: '' })
        router.replace('/')
      }
    },
    onError: toastApolloError,
  })

  function goBack() {
    router.back()
  }

  function logout() {
    logoutMutation()
  }

  function unregister() {
    unregisterMutation()
  }

  useNeedToLogin()

  return (
    <PageHead title={`@${userNickname} - 알파카살롱`} description={description}>
      <FlexContainerHeight100>
        <div>
          <TitleIconWrapper onClick={goBack}>
            <BackIcon />
            <h2>마이페이지</h2>
          </TitleIconWrapper>

          <GridContainerTemplate>
            <Image
              src={user?.imageUrl ?? '/images/default-profile-image.webp'}
              alt="profile-image"
              width="200"
              height="200"
            />
          </GridContainerTemplate>
        </div>

        {nickname === userNickname && (
          <FlexContainerColumnEnd>
            <GridContainerButtons>
              <PrimaryButton disabled={!nickname || logoutLoading} onClick={logout}>
                로그아웃
              </PrimaryButton>
              <RedButton disabled={!nickname || unregisterLoading} onClick={unregister}>
                회원탈퇴
              </RedButton>
            </GridContainerButtons>
          </FlexContainerColumnEnd>
        )}
      </FlexContainerHeight100>
    </PageHead>
  )
}
