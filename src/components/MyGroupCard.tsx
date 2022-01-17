import Image from 'next/image'
import { useRouter } from 'next/router'
import { ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import styled from 'styled-components'
import { Skeleton } from 'src/styles'

const Li = styled.li`
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 0.6rem;
  padding: 0.6rem;

  background: #fff;
  border: 1px solid #f6f6f6;
  border-radius: 20px;
`

const SquareFrame = styled.div`
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
`

const Grid = styled.div`
  display: grid;
  gap: 0.5rem;
`

const DarkGreyText = styled.div`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
`

const LoadingCard = styled.div`
  margin: 0 1rem;
  border: 1px solid #eee;
  border-radius: 20px;
  overflow: hidden;
  background-color: white;
`
const TextBox = styled.div`
  padding: 2rem 0.65rem;
  display: grid;
  gap: 0.6rem;

  > div:first-child {
    margin-bottom: 0.1rem;
  }
`

const Grid1 = styled(Grid)`
  align-content: space-evenly;
`

export function GroupLoadingCard() {
  return (
    <LoadingCard>
      <Skeleton height="8rem" borderRadius="0%" />
      <TextBox>
        <Skeleton width="70%" />
        <Skeleton width="80%" />
        <Skeleton width="15%" background="#fee" />
      </TextBox>
    </LoadingCard>
  )
}

export function MyGroupLoadingCard() {
  return (
    <Li>
      <Skeleton width="5.5rem" height="5.5rem" borderRadius="10px" />
      <Grid1>
        <Skeleton width="60%" />
        <Skeleton width="90%" />
      </Grid1>
    </Li>
  )
}

type Props2 = {
  group: any
}

function MyGroupCard({ group }: Props2) {
  const router = useRouter()

  return (
    <Li onClick={() => router.push(`/group/${group.id}`)}>
      <SquareFrame>
        <Image
          src={group.imageUrl ?? '/images/default-image.webp'}
          alt={group.imageUrl}
          layout="fill"
          objectFit="cover"
        />
      </SquareFrame>
      <FlexCenter>
        <Grid>
          <h3>{group.name}</h3>
          {group.newPostCount > 0 && (
            <DarkGreyText>하루 동안 새로운 게시물이 {group.newPostCount}개 올라왔어요</DarkGreyText>
          )}
        </Grid>
      </FlexCenter>
    </Li>
  )
}

export default MyGroupCard
