import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { ALPACA_SALON_COLOR } from 'src/models/constants'
import styled from 'styled-components'

const Grid = styled.li`
  display: grid;
  grid-template-rows: 4fr 3fr;

  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
`

const Frame16to7 = styled.div`
  aspect-ratio: 16 / 7;
  position: relative;
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
  line-height: 1.9rem;
`

const PrimaryH4 = styled.h4`
  color: ${ALPACA_SALON_COLOR};
`

export function applyLineBreak(line: string) {
  return line.split('\n').map((title, i) => (
    <Fragment key={i}>
      {title}
      <br />
    </Fragment>
  ))
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
