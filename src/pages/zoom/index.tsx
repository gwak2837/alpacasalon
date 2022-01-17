import { ReactElement, useState } from 'react'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import ZoomCard, { ZoomLoadingCard } from 'src/components/ZoomCard'
import { useZoomsQuery } from 'src/graphql/generated/types-and-hooks'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import Navigation from 'src/layouts/Navigation'
import { ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import styled from 'styled-components'

import { Background } from '../group'

const Ul = styled.ul`
  display: grid;
  gap: 1.5rem;

  padding: 0.6rem;
`

const H2 = styled.h2`
  padding: 0.6rem;
  font-weight: 500;
`

export const FetchedAllData = styled.div`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  text-align: center;
  margin: 15px 0;
`

const description = ''
const limit = 5

export default function ZoomsPage() {
  const [hasMoreData, setHasMoreData] = useState(true)

  const { data, loading } = useZoomsQuery({
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

  // 무한 스크롤
  const infiniteScrollRef = useInfiniteScroll({
    hasMoreData,
    onIntersecting: async () => {
      if (zooms && zooms.length > 0) {
        const lastZoom = zooms[zooms.length - 1]
        setHasMoreData(false)
      }
    },
  })

  return (
    <PageHead title="Zoom 대화방 - 알파카살롱" description={description}>
      <Background>
        <H2>경험자와의 진솔한 대화</H2>

        <Ul>
          {zooms?.map((zoom) => (
            <ZoomCard key={zoom.id} zoom={zoom} />
          ))}
          {loading && (
            <>
              <ZoomLoadingCard />
              <ZoomLoadingCard />
            </>
          )}
          {!loading && hasMoreData && <div ref={infiniteScrollRef}>무한 스크롤</div>}
          {!hasMoreData && <FetchedAllData>모든 게시글을 불러왔어요</FetchedAllData>}
        </Ul>
      </Background>
    </PageHead>
  )
}

ZoomsPage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
