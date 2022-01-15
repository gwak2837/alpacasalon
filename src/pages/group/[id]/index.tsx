import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { toastApolloError } from 'src/apollo/error'
import Drawer from 'src/components/atoms/Drawer'
import PageHead from 'src/components/PageHead'
import PostCard, { SquareWidth } from 'src/components/PostCard'
import {
  Post,
  useGroupQuery,
  useJoinGroupMutation,
  usePostsByGroupQuery,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { ALPACA_SALON_COLOR, ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import { PrimaryButton } from 'src/pages/post'
import BackIcon from 'src/svgs/back-icon.svg'
import DotDotDotIcon from 'src/svgs/dotdotdot.svg'
import LeaveIcon from 'src/svgs/leave.svg'
import WriteIcon from 'src/svgs/write-icon.svg'
import XIcon from 'src/svgs/x2.svg'
import styled from 'styled-components'

const Frame16to7 = styled.div`
  aspect-ratio: 16 / 7;
  position: relative;
  z-index: 1;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  cursor: pointer;
  padding: 1.2rem;

  > svg {
    width: 1.5rem;
  }
`

const Absolute = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 3rem;
  z-index: 1;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > svg {
    cursor: pointer;
    width: 3rem;
    padding: 0.5rem;
  }
`

const FixedButton = styled(PrimaryButton)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);

  margin: 0;
  padding: 0.8rem 1.8rem;
  white-space: nowrap;
`

const Relative = styled.div`
  position: relative;
  top: -3rem;
  background: #fafafa;
`

const Border = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20px;

  display: grid;
  gap: 0.6rem;
  margin: 0 2rem;
  padding: 1rem;
  text-align: center;

  position: relative;
  z-index: 2;
`

const Grey = styled.div`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  font-weight: 500;
  line-height: 150%;
`

const Height = styled.div`
  height: 0.3rem;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;

  > div {
    color: ${ALPACA_SALON_DARK_GREY_COLOR};
  }

  > div > a {
    font-weight: 600;
  }
`

const Grid = styled.ul`
  display: grid;
  gap: 1rem;
  padding: 0 0.6rem;
`

const description = ''

export default function GroupPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const groupId = (router.query.id ?? '') as string

  const { data: data2 } = useGroupQuery({
    onError: toastApolloError,
    skip: !groupId,
    variables: { id: groupId },
  })

  const { data } = usePostsByGroupQuery({
    onError: toastApolloError,
    skip: !groupId,
    variables: { groupId },
  })

  const [joinGroupMutataion, { loading }] = useJoinGroupMutation({
    onError: toastApolloError,
    refetchQueries: ['Group'],
    update: (cache) => {
      cache.evict({ fieldName: 'myGroups' })
    },
  })

  const group = data2?.group
  const posts = data?.postsByGroup
  const newMembers = data2?.group?.newMembers
  const newMember = newMembers?.[0]

  function goToPostCreationPage() {
    if (window.sessionStorage.getItem('jwt') || window.localStorage.getItem('jwt')) {
      router.push(`/post/create?groupId=${groupId}`)
    } else {
      toast.info('로그인이 필요합니다')
      sessionStorage.setItem('redirectionUrlAfterLogin', `/post/create?groupId=${groupId}`)
      router.push('/login')
    }
  }

  function goBack() {
    router.back()
  }

  function openDrawer() {
    setIsDrawerOpen(true)
  }

  function closeDrawer() {
    setIsDrawerOpen(false)
  }

  function toggleJoiningGroup() {
    joinGroupMutataion({ variables: { id: groupId } })
    setIsDrawerOpen(false)
  }

  useNeedToLogin()

  return (
    <PageHead title=" - 알파카살롱" description={description}>
      <Frame16to7>
        <Absolute>
          <BackIcon onClick={goBack} />
          <DotDotDotIcon onClick={openDrawer} />
        </Absolute>

        <Image
          src={group?.imageUrl ?? '/images/default-image.webp'}
          alt="group cover"
          layout="fill"
          objectFit="cover"
        />
      </Frame16to7>

      <Relative>
        <Border>
          <h3>{group?.name}</h3>
          <div>{group?.description}</div>
          <Height />
          <Grey>
            멤버수 {group?.memberCount}
            {group?.leader && ' | 방장' + group?.leader?.nickname}
          </Grey>
        </Border>

        {newMember && (
          <Flex>
            <Link href={`/@${newMember.nickname}`} passHref>
              <a>
                <SquareWidth>
                  <Image
                    src={newMember.imageUrl ?? '/images/default-profile-image.webp'}
                    alt="profile image"
                    layout="fill"
                    objectFit="cover"
                  />
                </SquareWidth>
              </a>
            </Link>
            <div>
              <Link href={`/@${newMember.nickname}`} passHref>
                <a>{newMember.nickname}</a>
              </Link>
              님{newMembers.length > 1 && ` 외 ${newMembers.length - 1}명`}이 새로 가입했어요 🙌
            </div>
          </Flex>
        )}

        <Grid>
          {posts?.map((post) => (
            <PostCard key={post.id} post={post as Post} />
          ))}
        </Grid>

        <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen}>
          <Button disabled={!group?.isJoined} onClick={toggleJoiningGroup}>
            <LeaveIcon /> 이 그룹 탈퇴하기
          </Button>
          <Button onClick={closeDrawer}>
            <XIcon /> 취소
          </Button>
        </Drawer>

        {group?.isJoined ? (
          <FixedButton disabled={!groupId} onClick={goToPostCreationPage}>
            <WriteIcon />
            글쓰기
          </FixedButton>
        ) : (
          <FixedButton disabled={!groupId || !group || loading} onClick={toggleJoiningGroup}>
            + 이 그룹 가입하기
            {loading && '...'}
          </FixedButton>
        )}
      </Relative>
    </PageHead>
  )
}
