import React, { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import PageHead from 'src/components/PageHead'
import { useMyGroupsQuery } from 'src/graphql/generated/types-and-hooks'
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

export default function PostsPage() {
  const { nickname } = useRecoilValue(currentUser)

  const { data } = useMyGroupsQuery({ skip: !nickname })

  return (
    <PageHead>
      {data?.myGroups?.map((group, i) => (
        <pre key={i}>{JSON.stringify(group, null, 2)}</pre>
      ))}
    </PageHead>
  )
}

PostsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Navigation>
      <PostTab>{page}</PostTab>
    </Navigation>
  )
}
