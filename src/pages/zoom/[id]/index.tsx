import Image from 'next/image'
import { useRouter } from 'next/router'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import { useZoomQuery } from 'src/graphql/generated/types-and-hooks'
import { ALPACA_SALON_COLOR } from 'src/models/constants'
import CalenderIcon from 'src/svgs/calender.svg'
import ClockIcon from 'src/svgs/clock.svg'
import styled from 'styled-components'

const Frame4to3 = styled.div`
  aspect-ratio: 4 / 3;
  position: relative;
`

const Sticky = styled.div`
  position: sticky;
  bottom: 0;
  margin: 1rem 0 0;
  padding: 0 1.25rem 1rem;
  text-align: center;

  background: #fff;
  border-top: 1px solid #eee;
`

const GreyText = styled.div`
  color: #787878;
  padding: 0.5rem 0 0.75rem;

  > span {
    font-weight: 600;
  }
`

const PrimaryButton = styled.button`
  background: ${ALPACA_SALON_COLOR};
  border-radius: 10px;
  color: #fff;

  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  > span {
    font-weight: 600;
  }
`

const description = ''

export default function ZoomPage() {
  const router = useRouter()
  const zoomId = (router.query.id ?? '') as string

  const { data, loading } = useZoomQuery({
    onError: toastApolloError,
    skip: !zoomId,
    variables: { id: zoomId },
  })

  const zoom = data?.zoom
  const whenWhats = data?.zoom?.whenWhat as string[] | undefined

  return (
    <PageHead title="줌 - 알파카살롱" description={description}>
      <Frame4to3>
        {loading || !zoom ? (
          <Image src="/images/default-image.webp" alt="" layout="fill" objectFit="cover" />
        ) : (
          <Image src={zoom.imageUrl} alt="" layout="fill" objectFit="cover" />
        )}
      </Frame4to3>
      <h3>{zoom?.title}</h3>
      <p>{zoom?.description}</p>

      <h2>언제 어디서 하나요?</h2>
      <div>
        <CalenderIcon />
        {zoom?.whenWhere}
      </div>

      <h2>무슨 이야기를 나누나요?</h2>
      {whenWhats?.map((whenWhat, i) => {
        switch (whenWhat[0]) {
          case '@':
            return (
              <h3 key={i}>
                <ClockIcon />
                {whenWhat.substring(1)}
              </h3>
            )
          case '#':
            return <h4 key={i}>{whenWhat.substring(1)}</h4>
          case '!':
            return <div key={i}>{whenWhat.substring(1)}</div>
          default:
            return <div>알 수 없는 접두사입니다</div>
        }
      })}

      <Sticky>
        <GreyText>
          현재 <span>1</span>명이 보고 있어요
        </GreyText>
        <PrimaryButton>
          <span>신청하기</span> (무료)
        </PrimaryButton>
      </Sticky>
    </PageHead>
  )
}
