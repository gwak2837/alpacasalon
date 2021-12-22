import React, { ReactElement } from 'react'
import PageHead from 'src/components/PageHead'
import Navigation from 'src/layouts/Navigation'
import PostTab from 'src/layouts/PostTab'
import { ALPACA_SALON_COLOR } from 'src/models/constants'
import styled from 'styled-components'

export const PrimaryH3 = styled.h3`
  color: ${ALPACA_SALON_COLOR};
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0.5rem;
`

export default function PostsPage() {
  return <PageHead>그룹페이지</PageHead>
}

PostsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Navigation>
      <PostTab>{page}</PostTab>
    </Navigation>
  )
}
