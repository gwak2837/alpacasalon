import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export default function useNeedToLogin() {
  const router = useRouter()

  useEffect(() => {
    if (!window.sessionStorage.getItem('jwt') && !window.localStorage.getItem('jwt')) {
      sessionStorage.setItem('redirectionUrlAfterLogin', router.asPath)
      toast.info('로그인이 필요합니다')
      router.replace('/login')
    }
  }, [router])
}
