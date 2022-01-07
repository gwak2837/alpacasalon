import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import ZoomCard from 'src/components/ZoomCard'
import { useZoomsQuery } from 'src/graphql/generated/types-and-hooks'
import Navigation from 'src/layouts/Navigation'
import styled from 'styled-components'

import { Background } from '../group'

const Ul = styled.ul`
  display: grid;
  gap: 1.5rem;

  padding: 0.6rem;
`

const description = ''
const limit = 5

export default function ZoomsPage() {
  const [hasMoreData, setHasMoreData] = useState(true)

  const { data } = useZoomsQuery({
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      toastApolloError(error)
      setHasMoreData(false)
    },
    skip: !limit,
    variables: {
      pagination: { limit },
    },
  })

  const zooms = data?.zooms

  return (
    <PageHead title=" - 알파카살롱" description={description}>
      <Background>
        <h2>경험자와의 진솔한 대화</h2>

        <Ul>
          {zooms?.map((zoom) => (
            <ZoomCard key={zoom.id} zoom={zoom} />
          ))}
        </Ul>
      </Background>
    </PageHead>
  )
}

ZoomsPage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
