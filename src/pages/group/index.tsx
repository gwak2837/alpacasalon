import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import { RecommendedGroupCard } from 'src/components/GroupCard'
import PageHead from 'src/components/PageHead'
import {
  useMyGroupsQuery,
  useRecommendationGroupsQuery,
} from 'src/graphql/generated/types-and-hooks'
import Navigation from 'src/layouts/Navigation'
import PostTab from 'src/layouts/PostTab'
import { ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import styled from 'styled-components'

const Padding = styled.div`
  background: #fcfcfc;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0.7rem 1rem;
`

const H3 = styled.h3`
  font-size: 1.25rem;
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
      <Padding>
        <Flex>
          <H3>추천 그룹</H3>
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
          <>
            <h4>내 그룹</h4>
            {isMyGroupLoading && <h5>내 그룹 로딩</h5>}
            {myGroups?.map((group) => (
              <pre
                key={group.id}
                onClick={() => router.push(`/group/${group.id}`)}
                style={{ overflow: 'scroll' }}
              >
                {JSON.stringify(group, null, 2)}
              </pre>
            ))}
          </>
        )}
      </Padding>
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
