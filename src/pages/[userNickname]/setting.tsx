import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import { PrimaryButton, RedButton } from 'src/components/atoms/Button'
import PageHead from 'src/components/PageHead'
import {
  useLogoutMutation,
  useUnregisterMutation,
  useUpdateProfileImageMutation,
  useUserByNicknameQuery,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { currentUser } from 'src/models/recoil'
import PlusIcon from 'src/svgs/+.svg'
import BackIcon from 'src/svgs/back-icon.svg'
import { getUserNickname, uploadImageFiles } from 'src/utils'
import styled from 'styled-components'

import { FileInput } from '../post/create'

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

  > label {
    grid-column: 2 / 3;
    grid-row: 2 / 4;
    cursor: pointer;
  }
`

const GridContainerButtons = styled.div`
  display: grid;
  gap: 1rem;

  padding: 2rem 0.5rem;
`

const FileInputLabel = styled.label<{ disabled?: boolean }>`
  position: relative;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  > span {
    border-radius: 50%;
  }

  > svg {
    width: min(max(1.5rem, 9vw), 3rem);
    position: absolute;
    bottom: 0;
    right: 0;
  }
`

export const FlexContainerColumnEnd = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const description = '알파카의 정보를 알아보세요'

export default function UserPage() {
  const [isProfileImageUpdating, setIsProfileImageUpdating] = useState(false)
  const router = useRouter()
  const userNickname = getUserNickname(router)
  const { nickname } = useRecoilValue(currentUser)
  const resetCurrentUser = useResetRecoilState(currentUser)

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
        resetCurrentUser()
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
        resetCurrentUser()
        router.replace('/')
      }
    },
    onError: toastApolloError,
  })

  const [updateProfileImageMutation, { loading: updateProfileImageLoading }] =
    useUpdateProfileImageMutation({
      onCompleted: ({ updateUser }) => {
        if (updateUser) {
          toast.success('프로필 이미지 변경에 성공했어요')
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

  async function updateProfileImage(e: ChangeEvent<HTMLInputElement>) {
    setIsProfileImageUpdating(true)
    const file = e.target.files?.[0]

    if (file) {
      const newFormData = new FormData()
      newFormData.append('images', file)
      const { imageUrls } = await uploadImageFiles(newFormData)
      await updateProfileImageMutation({
        variables: {
          input: {
            imageUrl: imageUrls[0],
          },
        },
      })
    }

    setIsProfileImageUpdating(false)
  }

  useNeedToLogin()

  return (
    <PageHead title={`@${userNickname} - 알파카살롱`} description={description}>
      <FlexContainerHeight100>
        <div>
          <TitleIconWrapper onClick={goBack}>
            <BackIcon />
          </TitleIconWrapper>

          <GridContainerTemplate>
            <FileInputLabel disabled={updateProfileImageLoading} htmlFor="profile-image">
              <Image
                src={user?.imageUrl ?? '/images/default-profile-image.webp'}
                alt="profile-image"
                width="200"
                height="200"
                objectFit="cover"
              />
              <PlusIcon />
              <FileInput
                accept="image/*"
                disabled={updateProfileImageLoading}
                id="profile-image"
                onChange={updateProfileImage}
                type="file"
              />
            </FileInputLabel>
          </GridContainerTemplate>
        </div>
        {isProfileImageUpdating && <div>프로필 이미지 변경 중...</div>}

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
