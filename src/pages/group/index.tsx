import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import MyGroupCard from 'src/components/MyGroupCard'
import PageHead from 'src/components/PageHead'
import RecommendedGroupCard from 'src/components/RecommendedGroupCard'
import {
  useMyGroupsQuery,
  useRecommendationGroupsQuery,
} from 'src/graphql/generated/types-and-hooks'
import Navigation from 'src/layouts/Navigation'
import PostTab from 'src/layouts/PostTab'
import { ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import styled from 'styled-components'

export const Background = styled.div`
  background: #fcfcfc;
  min-height: 100vh;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0.7rem 1rem;
`

const H2 = styled.h2`
  font-size: 1.25rem;
`

const Padding = styled.div`
  padding: 1.8rem 1rem;
  display: grid;
  gap: 0.8rem;
`

const A = styled.a`
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  font-weight: 500;
`

const Slider = styled.ul`
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;

  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;

  > li {
    scroll-snap-align: center;
    flex: 0 0 94%;
  }
`

export default function GroupsPage() {
  const router = useRouter() //
  const { nickname } = useRecoilValue(currentUser)

  const { data, loading: isRecommendedGroupLoading } = useRecommendationGroupsQuery({
    onError: toastApolloError,
  })
  const recommendationGroups = data?.recommendationGroups

  const { data: data2, loading: isMyGroupLoading } = useMyGroupsQuery({
    onError: toastApolloError,
    skip: !nickname,
  })
  const myGroups = data2?.myGroups

  return (
    <PageHead>
      <Background>
        <Flex>
          <H2>추천 그룹</H2>
          <Link href="/group/create" passHref>
            <A>새 그룹 만들기</A>
          </Link>
        </Flex>
        {isRecommendedGroupLoading && <h5>추천 그룹 로딩</h5>}

        <Slider>
          {recommendationGroups?.map((group) => (
            <RecommendedGroupCard key={group.id} group={group} />
          ))}
        </Slider>

        {nickname && (
          <Padding>
            {myGroups ? (
              <>
                <H2>내 그룹 {myGroups.length}개</H2>
                {isMyGroupLoading && <h5>내 그룹 로딩</h5>}
                {myGroups?.map((group) => (
                  <MyGroupCard key={group.id} group={group} />
                ))}
              </>
            ) : (
              <h5>내 그룹이 없어요</h5>
            )}
          </Padding>
        )}
      </Background>
    </PageHead>
  )
}

GroupsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Navigation>
      <PostTab>{page}</PostTab>
    </Navigation>
  )
}
