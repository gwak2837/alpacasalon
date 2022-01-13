import PageHead from 'src/components/PageHead'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import Close from 'src/svgs/close.svg'
import Icon from 'src/svgs/zoomReviewIcon.svg'
import { ALPACA_SALON_DARK_GREY_COLOR, ALPACA_SALON_GREY_COLOR } from 'src/models/constants'

const description = ''

const A = styled.button`
  cursor: pointer;
`
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`

const CompleteButton = styled.button`
  cursor: pointer;
  color: ${(p) => (p.disabled ? 'black' : ALPACA_SALON_GREY_COLOR)};
`

const ReviewContent = styled.div`
  padding: 20px;
`

const ContentText = styled.div`
  text-align: center;
  flex-direction: column;
  justify-content: center;
`

const Text = styled.div`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
`

const ReviewTitle = styled.div`
  margin: 25px 0 10px;
  font-size: 24px;
  font-weight: 500;
`

const ReviewInput = styled.textarea`
  width: 100%;
  height: 200px;
  margin-top: 25px;
  resize: none;
  padding: 10px;
  word-break: break-all;
  outline: none;
  border-radius: 10px;
  background-color: #fafafa;

  &::placeholder {
    color: ${ALPACA_SALON_GREY_COLOR};
  }
  &:focus {
    outline: 1px solid #e3e3e3;
  }
`

export default function ZoomReviewPage() {
  const { register, watch } = useForm()

  return (
    <PageHead title="후기 쓰기 - 알파카살롱" description={description}>
      <ReviewHeader>
        <A>
          <Close />
        </A>
        <CompleteButton disabled={Boolean(watch('reviewText')) ? true : false}>완료</CompleteButton>
      </ReviewHeader>
      <ReviewContent>
        <ContentText>
          <Icon />
          <ReviewTitle>참여한 zoom 대화는 어떠셨나요?</ReviewTitle>
          <Text>내 눈, 안검하수 해야 하는 눈일까?</Text>
        </ContentText>
        <ReviewInput
          {...register('reviewText')}
          placeholder="다른 사람들이 후기를 보고 도움 받을 수 있도록 솔직한 후기를 남겨주세요."
        />
      </ReviewContent>
    </PageHead>
  )
}
