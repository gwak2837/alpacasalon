import { ReactElement } from 'react'
import NavigationLayout from 'src/layouts/NavigationLayout'

export default function HomePage() {
  return <>홈페이지</>
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <NavigationLayout>{page}</NavigationLayout>
}
