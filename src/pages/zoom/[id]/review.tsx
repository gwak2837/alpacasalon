import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import { useZoomTitleByIdQuery } from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { ALPACA_SALON_DARK_GREY_COLOR, ALPACA_SALON_GREY_COLOR } from 'src/models/constants'
import Close from 'src/svgs/close.svg'
import ZoomReviewIcon from 'src/svgs/zoom-review.svg'
import { submitWhenShiftEnter } from 'src/utils'
import styled from 'styled-components'

const description = ''

const ReviewHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const XButton = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem;
`

const CompleteButton = styled.button`
  color: ${(p) => (p.disabled ? ALPACA_SALON_GREY_COLOR : '#000')};
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  padding: 1.25rem;
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

const ReviewTextarea = styled.textarea`
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

type ReviewForm = {
  contents: string
}

export default function ZoomReviewPage() {
  const router = useRouter()
  const zoomId = (router.query.id ?? '') as string

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<ReviewForm>({
    defaultValues: {
      contents: '',
    },
  })

  const { data, loading } = useZoomTitleByIdQuery({
    onError: toastApolloError,
    skip: !zoomId,
    variables: {
      id: zoomId,
    },
  })

  const zoom = data?.zoomTitleById

  function createReview(input: ReviewForm) {
    console.log('👀 - input', input)
  }

  function goBack() {
    router.back()
  }

  useNeedToLogin()

  return (
    <PageHead title="후기 쓰기 - 알파카살롱" description={description}>
      <form onSubmit={handleSubmit(createReview)}>
        <ReviewHeader>
          <XButton onClick={goBack}>
            <Close />
          </XButton>
          <CompleteButton disabled={!watch('contents')}>완료</CompleteButton>
        </ReviewHeader>
        <ReviewContent>
          <ContentText>
            <ZoomReviewIcon />
            <ReviewTitle>참여한 zoom 대화는 어떠셨나요?</ReviewTitle>
            <Text>{loading ? 'loading' : zoom?.title}</Text>
          </ContentText>
          <ReviewTextarea
            onKeyDown={submitWhenShiftEnter}
            placeholder="다른 사람들이 후기를 보고 도움 받을 수 있도록 솔직한 후기를 남겨주세요."
            {...register('contents', { required: '리뷰 내용을 작성한 후 완료를 눌러주세요' })}
          />
        </ReviewContent>
      </form>
    </PageHead>
  )
}
