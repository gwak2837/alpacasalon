import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { ALPACA_SALON_COLOR } from 'src/models/constants'
import { Skeleton } from 'src/styles'
import styled from 'styled-components'

const Grid = styled.li`
  display: grid;
  grid-template-rows: 4fr 3fr;

  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
`

const Frame16to7 = styled.div`
  aspect-ratio: 16 / 7;
  position: relative;
  /* height: 100%; */
`

const Flex = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.7rem;
`

const AbsoluteH3 = styled.h3`
  position: absolute;
  bottom: 0.7rem;
  left: 0.7rem;

  color: #fff;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 1.9rem;

  overflow: hidden;
  white-space: nowrap;
  width: calc(100% - 1rem);
  text-overflow: ellipsis;
  -webkit-text-stroke: 1px black;
`

const PrimaryH4 = styled.h4`
  color: ${ALPACA_SALON_COLOR};
  overflow: hidden;
  white-space: nowrap;
  width: calc(100% - 1rem);
  text-overflow: ellipsis;
`

const LoadingCard = styled.li`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  overflow: hidden;
`

const TextBox = styled.div`
  padding: 1rem 0.65rem;
  display: grid;
  gap: 0.6rem;

  > div:first-child {
    margin-bottom: 0.1rem;
  }
`

export function applyLineBreak(line: string) {
  return line.split('\n').map((title, i) => (
    <Fragment key={i}>
      {title}
      <br />
    </Fragment>
  ))
}

export function ZoomLoadingCard() {
  return (
    <LoadingCard>
      <Skeleton height="13rem" borderRadius="0%" />
      <TextBox>
        <Skeleton width="90%" />
        <Skeleton width="60%" />
        <Skeleton width="80%" background="#fee" />
      </TextBox>
    </LoadingCard>
  )
}

type Props = {
  zoom: any
}

function ZoomCard({ zoom }: Props) {
  const router = useRouter()

  return (
    <Grid onClick={() => router.push(`/zoom/${zoom.id}`)}>
      <Frame16to7>
        <Image src={zoom.imageUrl} alt={zoom.imageUrl} layout="fill" objectFit="cover" />
        <AbsoluteH3>{applyLineBreak(zoom.title)}</AbsoluteH3>
      </Frame16to7>
      <Flex>
        <h4>{zoom.description}</h4>
        <PrimaryH4>{zoom.whenWhere}</PrimaryH4>
      </Flex>
    </Grid>
  )
}

export default ZoomCard
