import { ReactElement } from 'react'
import PageHead from 'src/components/PageHead'
import Navigation from 'src/layouts/Navigation'

const description = ''

export default function ZoomsPage() {
  return (
    <PageHead title=" - 알파카살롱" description={description}>
      zooms
    </PageHead>
  )
}

ZoomsPage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
