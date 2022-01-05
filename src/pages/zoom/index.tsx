import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import { useZoomsQuery } from 'src/graphql/generated/types-and-hooks'
import Navigation from 'src/layouts/Navigation'

const description = ''
const limit = 5

export default function ZoomsPage() {
  const [hasMoreData, setHasMoreData] = useState(true)
  const router = useRouter()

  const { data } = useZoomsQuery({
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      toastApolloError(error)
      setHasMoreData(false)
    },
    skip: !limit,
    variables: {
      pagination: { limit },
    },
  })

  const zooms = data?.zooms

  return (
    <PageHead title=" - 알파카살롱" description={description}>
      <h2>경험자와의 진솔한 대화</h2>

      {zooms?.map((zoom) => (
        <pre
          key={zoom.id}
          onClick={() => router.push(`/zoom/${zoom.id}`)}
          style={{ overflow: 'scroll' }}
        >
          {JSON.stringify(zoom, null, 2)}
        </pre>
      ))}
    </PageHead>
  )
}

ZoomsPage.getLayout = function getLayout(page: ReactElement) {
  return <Navigation>{page}</Navigation>
}
