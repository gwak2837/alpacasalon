import { ReactNode } from 'react'
import { useRecoilState } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import { useMeQuery } from 'src/graphql/generated/types-and-hooks'
import { currentUser } from 'src/models/recoil'

type Props = {
  children: ReactNode
}

function Authentication({ children }: Props) {
  const [{ nickname }, setCurrentUser] = useRecoilState(currentUser)

  useMeQuery({
    onCompleted: ({ me }) => {
      if (me) {
        setCurrentUser({ nickname: me.nickname, hasNewNotifications: me.hasNewNotifications })
      }
    },
    onError: (error) => {
      toastApolloError(error)
      globalThis.sessionStorage?.removeItem('jwt')
      globalThis.localStorage?.removeItem('jwt')
    },
    // Storage에 jwt가 존재하는데 nickname이 없을 때만 요청
    skip: Boolean(
      nickname ||
        (!globalThis.sessionStorage?.getItem('jwt') && !globalThis.localStorage?.getItem('jwt'))
    ),
  })

  return <>{children}</>
}

export default Authentication
