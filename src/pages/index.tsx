import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import Navigation from 'src/layouts/Navigation'
import { currentUser } from 'src/models/recoil'
import AlpacasalonText from 'src/svgs/alpacasalon-text.svg'
import styled from 'styled-components'

const WhiteButton = styled.button`
  border: 1px solid #eee;
  border-radius: 5px;

  padding: 0.7rem;
`

export default function HomePage() {
  const router = useRouter()
  const { nickname } = useRecoilValue(currentUser)

  return (
    <div>
      <AlpacasalonText />
      {!nickname && <WhiteButton onClick={() => router.push('/login')}>로그인</WhiteButton>}
    </div>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
