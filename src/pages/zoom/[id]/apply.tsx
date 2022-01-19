import PageHead from 'src/components/PageHead'
import { ContentText, ReviewTitle, XButton } from 'src/pages/zoom/[id]/review'
import Close from 'src/svgs/close.svg'
import SuccessIcon from 'src/svgs/zoomApplyIcon.svg'
import NoticeIcon from 'src/svgs/strokeNoticeIcon.svg'
import styled from 'styled-components'
import {
  Grid,
  JoinContent,
  JoinFooter,
  JoinGroupButton,
  JoinHeader,
  JoinText,
} from 'src/pages/group/[id]/join'

const description = ''

const GuideText = styled(JoinText)`
  line-height: 2rem;
`

const NoticeText = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;

  align-items: center;
  border-radius: 10px;
  background-color: #fafafa;
  gap: 0.5rem;

  > span {
    width: 100%;
    line-height: 1.5rem
  }
`

export default function ZoomApplyPage() {
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
            <SuccessIcon />
            <ReviewTitle>신청이 완료되었어요</ReviewTitle>
          </ContentText>
          <GuideText>
            카카오톡으로 확인 알림을 드려요. <br />
            해당일에 줌 입장 링크를 발송해 드립니다.
          </GuideText>
        </JoinContent>
        <JoinFooter>
          <NoticeText>
            <NoticeIcon />
            <span>
              모두가 즐겁고 안전한 대화가 될 수 있도록 대화에서 나온 타인의 개인 정보를 외부에 유출
              시 제재를 받을 수 있습니다.
            </span>
          </NoticeText>
          <JoinGroupButton>다른 줌 대화도 둘러볼래요</JoinGroupButton>
        </JoinFooter>
      </Grid>
    </PageHead>
  )
}
