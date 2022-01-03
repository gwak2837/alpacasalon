import Link from 'next/link'
import PageHead from 'src/components/PageHead'

const description = ''

export default function Page() {
  return (
    <PageHead title="죄송합니다 - 알파카살롱" description={description}>
      <div>
        40대 이상 여성임을 증명하기 위해 회원가입 시 성별, 출생년도, 생일 제공에 동의해주세요
      </div>
      <br />
      <Link href="/login" passHref>
        <a>로그인 페이지로 이동</a>
      </Link>
    </PageHead>
  )
}
