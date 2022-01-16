import { Skeleton } from 'src/styles'
import styled from 'styled-components'

const Li = styled.li`
  overflow: auto;
`

export function ZoomReviewLoadingCard() {
  return (
    <Li>
      <Skeleton />
    </Li>
  )
}

type Props = {
  zoomReview: any
}

function ZoomReviewCard({ zoomReview }: Props) {
  return <Li>{JSON.stringify(zoomReview, null, 2)}</Li>
}

export default ZoomReviewCard
