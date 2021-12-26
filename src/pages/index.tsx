import { ReactElement } from 'react'
import Navigation from 'src/layouts/Navigation'

export default function HomePage() {
  return <div>홈페이지</div>
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
