import { ReactElement } from 'react'
import Navigation from 'src/layouts/Navigation'

export default function HomePage() {
  return <>홈페이지</>
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
