import Image from 'next/image'
import { useRouter } from 'next/router'
import { Skeleton } from 'src/styles'
import PeopleIcon from 'src/svgs/people.svg'
import styled from 'styled-components'

const Li = styled.li`
  display: grid;
  grid-template-rows: 1fr 1fr;

  aspect-ratio: 16 / 10;
  background: #fff;
  border: 1px solid #f6f6f6;
  border-radius: 20px;
  overflow: hidden;
`

const Frame16to5 = styled.div`
  aspect-ratio: 16 / 5;
  position: relative;
`

const Padding = styled.div`
  padding: 0.7rem;

  display: flex;
  flex-flow: column;
  justify-content: space-between;

  > div:first-child {
    display: grid;
    gap: 0.5rem;
  }
`

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`

export function GroupLoadingCard() {
  return (
    <Li>
      <Frame16to5>
        <Skeleton height="100%" />
      </Frame16to5>
      <Padding>
        <div>
          <Skeleton width="30%" />
          <Skeleton />
          <Skeleton width="70%" />
        </div>

        <FlexCenter>
          <PeopleIcon width="1.5rem" /> <Skeleton width="3rem" inlineBlock />명
        </FlexCenter>
      </Padding>
    </Li>
  )
}

type Props = {
  group: any
}

function RecommendedGroupCard({ group }: Props) {
  const router = useRouter()

  return (
    <Li onClick={() => router.push(`/group/${group.id}`)}>
      <Frame16to5>
        <Image
          src={group.imageUrl ?? '/images/default-image.webp'}
          alt={group.imageUrl}
          layout="fill"
          objectFit="cover"
        />
      </Frame16to5>

      <Padding>
        <div>
          <h3>{group.name}</h3>
          <div>{group.description}</div>
        </div>

        <FlexCenter>
          <PeopleIcon width="1.5rem" /> {group.memberCount}명
        </FlexCenter>
      </Padding>
    </Li>
  )
}

export default RecommendedGroupCard
