import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import { useJoinZoomMutation, useZoomQuery } from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { ALPACA_SALON_COLOR, ALPACA_SALON_DARK_GREY_COLOR } from 'src/models/constants'
import { HorizontalBorder as HorizontalBorder1 } from 'src/pages/post/[id]'
import BackIcon from 'src/svgs/back-icon.svg'
import CalenderIcon from 'src/svgs/calender.svg'
import ClockIcon from 'src/svgs/clock.svg'
import styled from 'styled-components'

const Frame4to3 = styled.div`
  aspect-ratio: 4 / 3;
  position: relative;

  > svg {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.5rem;
    width: 2.5rem;
    cursor: pointer;
  }

  > svg > path {
    stroke: #fff;
  }
`

const Absolute = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  display: grid;
  gap: 0.6rem;
  padding: 1.2rem;

  color: #fff;
`

const Padding = styled.div`
  padding: 1.2rem;
  flex-grow: 1;
`

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0 0 1.5rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.6rem 0.3rem;
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
  background: ${(p) => (p.disabled ? ALPACA_SALON_DARK_GREY_COLOR : ALPACA_SALON_COLOR)};
  border-radius: 10px;
  color: #fff;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};

  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  > span {
    font-weight: 600;
  }
`

const HorizontalBorder = styled(HorizontalBorder1)`
  margin: 1.5rem 0;
`

const H2 = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 0.6rem;
`

const H3 = styled.h3`
  color: ${ALPACA_SALON_COLOR};
  /* padding: 0 0 1rem; */
`

const H4 = styled.h4`
  grid-column: 2 / 3;
`

const Div = styled.div`
  grid-column: 2 / 3;
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

  const [joinZoomMutation] = useJoinZoomMutation({
    onError: toastApolloError,
    update: (cache) => {
      cache.evict({ fieldName: 'myZooms' })
    },
  })

  function joinZoom() {
    joinZoomMutation({ variables: { id: zoomId } })
  }

  function goBack() {
    router.back()
  }

  useNeedToLogin()

  return (
    <PageHead title="줌 - 알파카살롱" description={description}>
      <div style={{ display: 'flex', flexFlow: 'column' }}>
        <Frame4to3>
          <Image
            src={zoom?.imageUrl ?? '/images/default-image.webp'}
            alt=""
            layout="fill"
            objectFit="cover"
          />
          <BackIcon onClick={goBack} />
          <Absolute>
            <h3>{zoom?.title}</h3>
            <p>{zoom?.description}</p>
          </Absolute>
        </Frame4to3>

        <Padding>
          <H2>언제 어디서 하나요?</H2>
          <FlexCenter>
            <CalenderIcon />
            {zoom?.whenWhere}
          </FlexCenter>

          <H2>무슨 이야기를 나누나요?</H2>

          <Grid>
            {whenWhats?.map((whenWhat, i) => {
              switch (whenWhat[0]) {
                case '@':
                  return (
                    <>
                      <ClockIcon />
                      <H3 key={i}>{whenWhat.substring(1)}</H3>
                    </>
                  )
                case '#':
                  return <H4 key={i}>{whenWhat.substring(1)}</H4>
                case '!':
                  return <Div key={i}>{whenWhat.substring(1)}</Div>
                default:
                  return <div>알 수 없는 접두사입니다</div>
              }
            })}
          </Grid>

          <HorizontalBorder />

          <Link href={`${router.asPath}/review`} passHref>
            <a>후기 쓰기</a>
          </Link>
        </Padding>

        <Sticky>
          <GreyText>
            현재 <span>1</span>명이 보고 있어요
          </GreyText>
          <PrimaryButton disabled={zoom?.isJoined || !zoomId} onClick={joinZoom}>
            {zoom?.isJoined ? (
              <span>신청 완료했어요</span>
            ) : (
              <>
                <span>신청하기</span> (무료)
              </>
            )}
          </PrimaryButton>
        </Sticky>
      </div>
    </PageHead>
  )
}
