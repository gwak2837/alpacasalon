import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ReactElement, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import FamousPostCard, { FamousPostLoadingCard } from 'src/components/FamousPostCard'
import PageHead from 'src/components/PageHead'
import PostCard, { PostLoadingCard } from 'src/components/PostCard'
import { Post, useFamousPostsQuery, usePostsQuery } from 'src/graphql/generated/types-and-hooks'
import useInfiniteScroll from 'src/hooks/useInfiniteScroll'
import NavigationLayout from 'src/layouts/NavigationLayout'
import {
  ALPACA_SALON_COLOR,
  ALPACA_SALON_DARK_GREY_COLOR,
  NAVIGATION_HEIGHT,
  TABLET_MIN_WIDTH,
} from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import WriteIcon from 'src/svgs/write-icon.svg'
import styled from 'styled-components'

const Background = styled.div`
  background: #e2d7ec;
`

const Sticky = styled.div`
  position: sticky;
  top: 0;
  z-index: 0;
`

const FlexBetweenCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem;
`

const H2 = styled.h2`
  font-family: tvN EnjoystoriesOTF;
`

const WhiteButton = styled.button`
  background: #ffffff20;
  border: 1px solid #888;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
`

const Frame16to11 = styled.div`
  position: relative;
  aspect-ratio: 16 / 11;

  background: #e2d7ec;
`

const BorderRadius = styled.div`
  background: #fafafa;
  border-radius: 1.2rem 1.2rem 0px 0px;
  padding: 1rem 0.65rem;
  /* position: relative;
  z-index: 1; */
`

export const PrimaryH3 = styled.h3`
  color: ${ALPACA_SALON_COLOR};
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
`

const GreyH5 = styled.h5`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  font-size: 14px;
  margin-top: 0.5rem;
`

const GridContainerPost = styled.ul`
  display: grid;
  gap: 0.9rem;
  padding: 1rem 0;
`

const FixedPosition = styled.div`
  position: fixed;
  bottom: ${NAVIGATION_HEIGHT};
  z-index: 1;
  width: 100%;
  max-width: ${TABLET_MIN_WIDTH};

  display: flex;
  justify-content: flex-end;

  padding: 1.25rem;
`

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  background: #7c2f70;
  box-shadow: 0px 4px 20px rgba(16, 16, 16, 0.25);
  border: none;
  border-radius: 10px;
  color: #fff;
  padding: 0.7rem 1rem;
`

const limit = 5

export default function PostsPage() {
  const [hasMoreData, setHasMoreData] = useState(true)
  const router = useRouter()
  const { nickname } = useRecoilValue(currentUser)

  const { data: data2, loading: famousPostsLoading } = useFamousPostsQuery({
    onError: toastApolloError,
  })

  const famousPosts = data2?.famousPosts

  // 데이터 요청
  const { data, loading, fetchMore } = usePostsQuery({
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

  const posts = data?.posts

  // 무한 스크롤
  const infiniteScrollRef = useInfiniteScroll({
    hasMoreData,
    onIntersecting: async () => {
      if (posts && posts.length > 0) {
        const lastPost = posts[posts.length - 1]
        const response = await fetchMore({
          variables: {
            pagination: {
              lastId: lastPost.id,
              limit,
            },
          },
        }).catch(() => setHasMoreData(false))

        if (response?.data.posts?.length !== limit) setHasMoreData(false)
      }
    },
  })

  function goToPostCreationPage() {
    if (window.sessionStorage.getItem('jwt') || window.localStorage.getItem('jwt')) {
      router.push('/post/create')
    } else {
      toast.info('로그인이 필요합니다')
      sessionStorage.setItem('redirectionUrlAfterLogin', '/post/create')
      router.push('/login')
    }
  }

  return (
    <PageHead>
      <Background>
        <FlexBetweenCenter>
          <H2>알파카살롱</H2>
          {nickname ? (
            <WhiteButton onClick={() => router.push(`/@${nickname}`)}>마이페이지</WhiteButton>
          ) : (
            <WhiteButton onClick={() => router.push('/login')}>로그인</WhiteButton>
          )}
        </FlexBetweenCenter>

        <BorderRadius>
          <PrimaryH3>이번 달 핫한 이야기</PrimaryH3>
          <GreyH5>관리자 알파카가 이번 주에 도움이 되는 질문들을 선별해 소개해요.</GreyH5>
          <GridContainerPost>
            {famousPosts
              ? famousPosts.map((famousPost, i) => (
                  <FamousPostCard key={i} famousPost={famousPost} index={i + 1} />
                ))
              : !famousPostsLoading && <div>핫한 이야기가 없어요</div>}
            {famousPostsLoading && (
              <>
                <FamousPostLoadingCard />
                <FamousPostLoadingCard />
                <FamousPostLoadingCard />
              </>
            )}
          </GridContainerPost>

          <PrimaryH3>최신 이야기</PrimaryH3>
          <GridContainerPost>
            {posts
              ? posts.map((post, i) => <PostCard key={i} post={post as Post} />)
              : !loading && <div>최신 이야기가 없어요</div>}
            {loading && (
              <>
                <PostLoadingCard />
                <PostLoadingCard />
              </>
            )}
          </GridContainerPost>
          {!loading && hasMoreData && <div ref={infiniteScrollRef}>무한 스크롤</div>}
          {!hasMoreData && <div>모든 게시글을 불러왔어요</div>}
        </BorderRadius>

        <FixedPosition>
          <PrimaryButton onClick={goToPostCreationPage}>
            <WriteIcon />
            글쓰기
          </PrimaryButton>
        </FixedPosition>
      </Background>
    </PageHead>
  )
}

PostsPage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
