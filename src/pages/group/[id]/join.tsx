import PageHead from 'src/components/PageHead'
import { ContentText, ReviewTitle, XButton } from 'src/pages/zoom/[id]/review'
import Close from 'src/svgs/close.svg'
import NoticeIcon from 'src/svgs/noticeIcon.svg'
import styled from 'styled-components'
import { ALPACA_SALON_COLOR, ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'

const description = ''

const Grid = styled.div`
  display: grid;
  height: 100vh;
  padding: 20px;
`

const JoinHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const JoinContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`

const JoinText = styled.div`
  margin-top: 30px;
  font-weight: 300;
`

const JoinFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Button = styled.button`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  margin: 35px 0 15px;
`

const JoinGroupButton = styled.button`
  width: 100%;
  color: white;
  padding: 17px 0;
  border-radius: 10px;
  background-color: ${ALPACA_SALON_COLOR};
`

export default function GroupJoinPage() {
  return (
    <PageHead title=" - 알파카살롱" description={description}>
      <JoinHeader>
        <XButton>
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
          <Button>괜찮아요</Button>
          <JoinGroupButton>이 그룹 가입하기</JoinGroupButton>
        </JoinFooter>
      </Grid>
    </PageHead>
  )
}
