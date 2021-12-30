import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import {
  useMyGroupsQuery,
  useRecommendationGroupsQuery,
} from 'src/graphql/generated/types-and-hooks'
import Navigation from 'src/layouts/Navigation'
import PostTab from 'src/layouts/PostTab'
import { ALPACA_SALON_COLOR } from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import styled from 'styled-components'

export const PrimaryH3 = styled.h3`
  color: ${ALPACA_SALON_COLOR};
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
`

export default function GroupsPage() {
  const router = useRouter()
  const { nickname } = useRecoilValue(currentUser)

  const { data } = useRecommendationGroupsQuery({ onError: toastApolloError, skip: !nickname })
  const recommendationGroups = data?.recommendationGroups

  const { data: data2 } = useMyGroupsQuery({ onError: toastApolloError, skip: !nickname })
  const myGroups = data2?.myGroups

  return (
    <PageHead>
      <h4>추천 그룹</h4>
      {recommendationGroups?.map((group) => (
        <pre key={group.id} onClick={() => router.push(`/group/${group.id}`)}>
          {JSON.stringify(group, null, 2)}
        </pre>
      ))}

      <h4>내 그룹</h4>
      {myGroups?.map((group) => (
        <pre key={group.id} onClick={() => router.push(`/group/${group.id}`)}>
          {JSON.stringify(group, null, 2)}
        </pre>
      ))}

      <Link href="/group/create" passHref>
        <a>내 마음에 드는 그룹이 없나요?</a>
      </Link>
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
