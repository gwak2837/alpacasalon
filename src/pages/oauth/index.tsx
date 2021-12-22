import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import PageHead from 'src/components/PageHead'
import { currentUser } from 'src/models/recoil'

const description = ''

export default function EventDetailPage() {
  const url = useRef('')
  const router = useRouter()
  const setCurrentUser = useSetRecoilState(currentUser)

  useEffect(() => {
    const queryString = new URLSearchParams(window.location.search.substr(1))
    const jwt = queryString.get('jwt')
    const nickname = queryString.get('nickname')

    if (jwt && nickname) {
      toast.success('소셜 로그인에 성공했어요')

      if (sessionStorage.getItem('autoLogin')) {
        localStorage.setItem('jwt', jwt)
        sessionStorage.removeItem('autoLogin')
      } else {
        sessionStorage.setItem('jwt', jwt)
      }

      setCurrentUser({ nickname })

      const redirectionUrlAfterLogin = sessionStorage.getItem('redirectionUrlAfterLogin') ?? '/'

      if (redirectionUrlAfterLogin.startsWith('/@')) {
        url.current = `/@${nickname}`
      } else {
        url.current = redirectionUrlAfterLogin
      }

      sessionStorage.removeItem('redirectionUrlAfterLogin')
    }
  }, [setCurrentUser])

  useEffect(() => {
    router.replace(url.current)
  }, [router])

  return (
    <PageHead title="소셜 로그인 - 알파카살롱" description={description}>
      <div>소셜 로그인에 성공했어요. 잠시만 기다려주세요...</div>
    </PageHead>
  )
}
