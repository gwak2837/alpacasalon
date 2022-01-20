import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import ZoomReviewCard, { ZoomReviewLoadingCard } from 'src/components/ZoomReviewCard'
import {
  ZoomReview,
  useJoinZoomMutation,
  useZoomQuery,
  useZoomReviewsQuery,
} from 'src/graphql/generated/types-and-hooks'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { ALPACA_SALON_COLOR, ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import { HorizontalBorder as HorizontalBorder1 } from 'src/pages/post/[id]'
import BackIcon from 'src/svgs/back-icon.svg'
import CalenderIcon from 'src/svgs/calender.svg'
import ClockIcon from 'src/svgs/clock.svg'
import styled from 'styled-components'

import { FetchedAllData } from '../index'

const Frame4to3 = styled.div`
  aspect-ratio: 4 / 3;
  position: relative;

  > svg {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5rem;
    width: 2.5rem;
    cursor: pointer;
  }

  > svg > path {
    stroke: #fff;
  }
`

const Absolute = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  display: grid;
  gap: 0.6rem;
  padding: 1.2rem;

  color: #fff;
`

const Padding = styled.div`
  padding: 1.2rem;
  flex-grow: 1;
`

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0 0 1.5rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.6rem 0.3rem;
`

const Sticky = styled.div`
  position: sticky;
  bottom: 0;
  margin: 1rem 0 0;
  padding: 0 1.25rem 1rem;
  text-align: center;

  background: #fff;
  border-top: 1px solid #eee;
`

const GreyText = styled.div`
  color: #787878;
  padding: 0.5rem 0 0.75rem;

  > span {
    font-weight: 600;
  }
`

const PrimaryButton = styled.button`
  background: ${(p) => (p.disabled ? ALPACA_SALON_DARK_GREY_COLOR : ALPACA_SALON_COLOR)};
  border-radius: 10px;
  color: #fff;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};

  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  > span {
    font-weight: 600;
  }
`

const HorizontalBorder = styled(HorizontalBorder1)`
  margin: 1.5rem 0;
`

const H2 = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 0.6rem;
`

const H3 = styled.h3`
  color: ${ALPACA_SALON_COLOR};
`

const H4 = styled.h4`
  grid-column: 2 / 3;
`

const Div = styled.div`
  grid-column: 2 / 3;
`

const GridUl = styled.ul`
  display: grid;
  gap: 1rem;
`

const FlexBetweenStart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 0 0 0.6rem;
`

const ReviewH3 = styled.h3`
  font-size: 1.25rem;
`

const A = styled.a`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
`

const limit = 10
const description = ''

export default function ZoomPage() {
  const router = useRouter()
  const zoomId = (router.query.id ?? '') as string

  // Zoom 상세 정보 불러오기
  const { data, loading } = useZoomQuery({
    onError: toastApolloError,
    skip: !zoomId,
    variables: { id: zoomId },
  })

  const zoom = data?.zoom
  const whenWhats = data?.zoom?.whenWhat as string[] | undefined

  // Zoom 참가
  const [joinZoomMutation] = useJoinZoomMutation({
    onError: toastApolloError,
    update: (cache) => {
      cache.evict({ fieldName: 'myZooms' })
    },
  })

  // Zoom 리뷰 목록 불러오기
  const [hasMoreData, setHasMoreData] = useState(true)

  const {
    data: data2,
    loading: isZoomReviewLoading,
    fetchMore,
  } = useZoomReviewsQuery({
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      toastApolloError(error)
      setHasMoreData(false)
    },
    skip: !zoomId || !limit,
    variables: {
      zoomId,
      pagination: { limit },
    },
  })

  const zoomReviews = data2?.zoomReviews

  const infiniteScrollRef = useInfiniteScroll({
    hasMoreData,
    onIntersecting: async () => {
      if (zoomReviews && zoomReviews.length > 0) {
        const lastZoomReview = zoomReviews[zoomReviews.length - 1]
        const response = await fetchMore({
          variables: {
            pagination: {
              lastId: lastZoomReview.id,
              limit,
            },
          },
        }).catch(() => setHasMoreData(false))

        if (response?.data.zoomReviews?.length !== limit) setHasMoreData(false)
      }
    },
  })

  function joinZoom() {
    joinZoomMutation({ variables: { id: zoomId } })
    router.push('apply')
  }

  function goBack() {
    router.back()
  }

  useNeedToLogin()

  return (
    <PageHead title="줌 - 알파카살롱" description={description}>
      <Frame4to3>
        <Image
          src={zoom?.imageUrl ?? '/images/default-image.webp'}
          alt=""
          layout="fill"
          objectFit="cover"
        />
        <BackIcon onClick={goBack} />
        <Absolute>
          <h3>{zoom?.title}</h3>
          <p>{zoom?.description}</p>
        </Absolute>
      </Frame4to3>

      <Padding>
        <H2>언제 어디서 하나요?</H2>
        <FlexCenter>
          <CalenderIcon />
          {zoom?.whenWhere}
        </FlexCenter>

        <H2>무슨 이야기를 나누나요?</H2>

        <Grid>
          {whenWhats?.map((whenWhat, i) => {
            switch (whenWhat[0]) {
              case '@':
                return (
                  <>
                    <ClockIcon />
                    <H3 key={i}>{whenWhat.substring(1)}</H3>
                  </>
                )
              case '#':
                return <H4 key={i}>{whenWhat.substring(1)}</H4>
              case '!':
                return <Div key={i}>{whenWhat.substring(1)}</Div>
              default:
                return <div>알 수 없는 접두사입니다</div>
            }
          })}
        </Grid>

        <HorizontalBorder />

        <FlexBetweenStart>
          <ReviewH3>이전 회차 후기</ReviewH3>
          <Link href={`${router.asPath}/review`} passHref>
            <A>후기 쓰기</A>
          </Link>
        </FlexBetweenStart>

        <GridUl>
          {zoomReviews
            ? zoomReviews.map((zoomReview, i) => (
                <ZoomReviewCard key={i} zoomReview={zoomReview as ZoomReview} />
              ))
            : !isZoomReviewLoading && <div>최신 후기가 없어요</div>}
          {isZoomReviewLoading && (
            <>
              <ZoomReviewLoadingCard />
              <ZoomReviewLoadingCard />
            </>
          )}
        </GridUl>
        {!isZoomReviewLoading && hasMoreData && <div ref={infiniteScrollRef}>무한 스크롤</div>}
        {!hasMoreData && <FetchedAllData>모든 후기를 불러왔어요</FetchedAllData>}
      </Padding>

      <Sticky>
        <GreyText>
          현재 <span>1</span>명이 보고 있어요
        </GreyText>
        <PrimaryButton disabled={zoom?.isJoined || !zoomId} onClick={joinZoom}>
          {zoom?.isJoined ? (
            <span>신청 완료했어요</span>
          ) : (
            <>
              <span>신청하기</span> (무료)
            </>
          )}
        </PrimaryButton>
      </Sticky>
    </PageHead>
  )
}
