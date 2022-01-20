import { useRouter } from 'next/router'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import { useGroupNameQuery, useJoinGroupMutation } from 'src/graphql/generated/types-and-hooks'
import { ALPACA_SALON_COLOR, ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import { ContentText, ReviewTitle, XButton } from 'src/pages/zoom/[id]/review'
import Close from 'src/svgs/close.svg'
import NoticeIcon from 'src/svgs/noticeIcon.svg'
import styled from 'styled-components'

const description = ''

export const Grid = styled.div`
  display: grid;
  height: 100vh;
  padding: 20px;
`

export const JoinHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const JoinContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`

export const JoinText = styled.div`
  margin-top: 30px;
  font-weight: 300;
`

export const JoinFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`

export const Button = styled.button`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
`

export const JoinGroupButton = styled.button`
  width: 100%;
  color: white;
  padding: 17px 0;
  border-radius: 10px;
  background-color: ${ALPACA_SALON_COLOR};

  > span {
    font-weight: 600;
  }
`

export default function GroupJoinPage() {
  // 클라이언트측 라우팅
  const router = useRouter()
  const groupId = (router.query.id ?? '') as string

  function goBack() {
    router.back()
  }

  // 그룹 이름 불러오기
  const { data } = useGroupNameQuery({
    onError: toastApolloError,
    skip: !groupId,
    variables: { id: groupId },
  })

  const group = data?.group

  // 그룹 참여 요청하기
  const [joinGroupMutataion, { loading }] = useJoinGroupMutation({
    onError: toastApolloError,
    update: (cache) => {
      cache.evict({ fieldName: 'myGroups' })
    },
  })

  function toggleJoiningGroup() {
    joinGroupMutataion({ variables: { id: groupId } })
  }

  return (
    <PageHead title={`${group?.name ?? '그룹'} 참가하기 - 알파카살롱`} description={description}>
      <JoinHeader>
        <XButton onClick={goBack}>
          <Close />
        </XButton>
      </JoinHeader>
      <Grid>
        <JoinContent>
          <ContentText>
            <NoticeIcon />
            <ReviewTitle>이 글은 그룹 멤버들만 볼 수 있어요</ReviewTitle>
          </ContentText>
          <JoinText>그룹에 가입해서 게시글과 댓글을 확인하세요</JoinText>
        </JoinContent>
        <JoinFooter>
          <Button disabled={loading} onClick={goBack}>
            괜찮아요
          </Button>
          <JoinGroupButton disabled={loading} onClick={toggleJoiningGroup}>
            <span>{group?.name}</span> 가입하기
          </JoinGroupButton>
        </JoinFooter>
      </Grid>
    </PageHead>
  )
}
