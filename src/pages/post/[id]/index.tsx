import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import Modal from 'src/components/atoms/Modal'
import CommentCard, { CommentLoadingCard } from 'src/components/CommentCard'
import PageHead from 'src/components/PageHead'
import {
  Comment,
  CreateCommentMutationVariables,
  useCommentsByPostQuery,
  useCreateCommentMutation,
  usePostQuery,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { ALPACA_SALON_COLOR, ALPACA_SALON_GREY_COLOR, TABLET_MIN_WIDTH } from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import { Skeleton } from 'src/styles'
import BackIcon from 'src/svgs/back-icon.svg'
import GreyWriteIcon from 'src/svgs/grey-write-icon.svg'
import LoadingSpinner from 'src/svgs/LoadingSpinner'
import Submit from 'src/svgs/submit.svg'
import XIcon from 'src/svgs/x.svg'
import { submitWhenShiftEnter } from 'src/utils'
import styled, { css } from 'styled-components'

import { Slider } from '../create'

const FlexContainerBetweenCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  top: 0;
  width: 100%;
  max-width: ${TABLET_MIN_WIDTH};
  z-index: 1;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0.75rem 0.6rem;

  > svg {
    width: 1.5rem;
    cursor: pointer;
  }
`

const Padding = styled.div`
  padding-top: 4.35rem;
`

const ModificationButton = styled.button<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;

  background: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  color: ${ALPACA_SALON_GREY_COLOR};
  visibility: ${(p) => (p.visible ? 'visible' : 'hidden')};

  :hover,
  :focus,
  :active {
    border-color: ${ALPACA_SALON_COLOR};
    color: ${ALPACA_SALON_COLOR};

    > svg > path {
      fill: ${ALPACA_SALON_COLOR};
    }
  }

  > svg > path {
    transition: fill 0.3s ease-out;
  }

  transition: border-color 0.3s ease-out, color 0.3s ease-out;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem;
  align-items: center;

  padding: 0.6rem;

  > span {
    border-radius: 50%;
    cursor: pointer;
  }
`

export const GridGap = styled.div`
  display: grid;
  gap: 0.4rem;
`

export const H5 = styled.h5`
  cursor: pointer;
`

export const GreyH5 = styled.h5`
  color: ${ALPACA_SALON_GREY_COLOR};
  font-weight: normal;
`

const GridGap2 = styled.div`
  display: grid;
  gap: 0.7rem;
  padding: 1rem 0.6rem;
`

const P = styled.p`
  line-height: 1.6rem;
  margin: 1rem 0;
`

export const Frame16to11 = styled.div`
  position: relative;
  aspect-ratio: 16 / 11;
  border-radius: 10px;
  overflow: hidden;
`

const Frame16to11DefaultImage = styled(Frame16to11)`
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('/images/default-image.webp');
`

const HorizontalBorder = styled.div`
  border-top: 1px solid #eee;
`

const GreyButton = styled.button`
  background: #fff;
  color: #888;
  padding: 1.3rem 0.8rem;
  text-align: left;

  :hover,
  :focus {
    color: ${ALPACA_SALON_COLOR};
  }

  transition: color 0.3s ease-out;
`

const GridUl = styled.ul`
  display: grid;
  gap: 2rem;

  padding: 0.75rem 0.6rem;
`

const StickyForm = styled.form`
  position: sticky;
  bottom: 0;

  background: #fff;
  border-top: 1px solid #f3f3f3;
  width: 100%;
`

const FlexBetween = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`

const FlexColumnGrow = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;

  > :last-child {
    flex-grow: 1;
  }
`

const CommentTextarea = styled.textarea`
  width: calc(100% - 1.2rem);
  height: 2.8rem;
  min-height: 2.8rem;
  max-height: 6rem;
  margin: 0.6rem;
  padding: 0.6rem 2.6rem 0.6rem 1.2rem;

  background: #f4f4f4;
  border: none;
  border-radius: 1.25rem;
  resize: none;
`

const fillGrey = css`
  > svg > rect {
    fill: ${ALPACA_SALON_GREY_COLOR};
  }
`

const AbsoluteCSS = css`
  position: absolute;
  bottom: 0.75rem;
  right: 0.5rem;

  width: 3rem;
  height: 3rem;
  padding: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Absolute = styled.div`
  ${AbsoluteCSS};
`

const CommentSubmitButton = styled.button`
  ${AbsoluteCSS};
  ${(p) => p.disabled && fillGrey};

  > svg {
    width: 3rem;
    height: 3rem;
  }
`

const GreyDiv = styled.div`
  line-height: 19px;
  color: ${ALPACA_SALON_GREY_COLOR};
  text-align: center;
  margin: 5rem auto;
`

const Relative = styled.div`
  position: relative;

  color: #787878;
  padding: 0.6rem;

  > svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.2rem;
    padding: 0.6rem;
  }
`

const H4 = styled.h4`
  color: #787878;
  margin: 0 0 0.3rem;
`

const PrimarySpan = styled.span<{ disabled?: boolean }>`
  color: ${(p) => (p.disabled ? ALPACA_SALON_GREY_COLOR : ALPACA_SALON_COLOR)};
`

const EllipsisText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;

  width: 100%;
  height: 1.2rem;
  white-space: nowrap;
`

const disabledAnchor = css`
  pointer-events: none;
  cursor: default;
`

export const A = styled.a<{ disabled?: boolean }>`
  ${(p) => p.disabled && disabledAnchor}
  width: fit-content;
`

const Slide = styled.li`
  scroll-snap-align: center;
  flex: 0 0 100%;

  aspect-ratio: 16 / 11;
  position: relative;
  width: 100%;
  height: 100%; // For Safari 15
`

function stopPropagationWhenImageClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
  const img = e.target as HTMLImageElement
  const ratio = img.naturalWidth / img.naturalHeight
  const width = Math.floor(img.height * ratio)
  if (width > img.width) {
    const height = img.width / ratio
    const top = (img.height - height) / 2
    const bottom = (img.height + height) / 2
    const clientY = e.clientY

    if (clientY > top && clientY < bottom) {
      e.stopPropagation()
    }
  } else {
    const left = (img.width - width) / 2
    const right = (img.width + width) / 2
    const clientX = e.clientX

    if (clientX > left && clientX < right) {
      e.stopPropagation()
    }
  }
}

type CommentCreationForm = {
  contents: string
}

type ParentComment = {
  id: string
  nickname: string
  contents: string
}

const description = ''

export default function PostPage() {
  const [parentComment, setParentComment] = useState<ParentComment>()
  const [isImageDetailOpen, setIsImageDetailOpen] = useState(false)
  const commentTextareaRef = useRef<HTMLTextAreaElement>()
  const newCommentId = useRef('')
  const clickedImageNumber = useRef(-1)
  const { nickname } = useRecoilValue(currentUser)
  const router = useRouter()
  const postId = (router.query.id ?? '') as string

  const { data, loading: postLoading } = usePostQuery({
    onError: toastApolloError,
    skip: !postId || !nickname,
    variables: { id: postId },
  })

  const post = data?.post
  const commentCount = post?.commentCount
  const author = data?.post?.user

  const { data: data2, loading: commentsLoading } = useCommentsByPostQuery({
    onError: toastApolloError,
    skip: !postId || !nickname,
    variables: { postId },
  })

  const comments = data2?.commentsByPost

  const [createCommentMutation, { loading }] = useCreateCommentMutation({
    onCompleted: ({ createComment }) => {
      if (createComment) {
        newCommentId.current = createComment.id
        toast.success('댓글을 작성했어요')
        setParentComment(undefined)
        if (commentTextareaRef.current) commentTextareaRef.current.style.height = '2.8rem'
      }
    },
    onError: toastApolloError,
    refetchQueries: ['CommentsByPost', 'Post'],
  })

  const { handleSubmit, register, reset, setFocus, watch } = useForm<CommentCreationForm>({
    defaultValues: { contents: '' },
  })

  const contentsLineCount = watch('contents').length
  const { ref, ...registerCommentCreationForm } = register('contents', {
    required: '댓글을 입력해주세요',
  })

  function createComment({ contents }: CommentCreationForm) {
    const variables: CreateCommentMutationVariables = { contents, postId }
    if (parentComment) variables.commentId = parentComment.id

    createCommentMutation({ variables })
    reset()
  }

  function goBack() {
    router.back()
  }

  function goToPostUpdatePage() {
    router.push(router.asPath + '/update')
  }

  function resetParentComment() {
    setParentComment(undefined)
  }

  function goToUserDetailPage() {
    router.push(`/@${author?.nickname}`)
  }

  function writeComment() {
    setParentComment(undefined)
    setFocus('contents')
  }

  function resizeTextareaHeight(e: KeyboardEvent<HTMLTextAreaElement>) {
    const eventTarget = e.target as HTMLTextAreaElement
    // eventTarget.style.height = 'auto' // mobile 스크롤 위치 이슈
    eventTarget.style.height = `${eventTarget.scrollHeight}px`
  }

  function registerTextareaRef(textarea: HTMLTextAreaElement) {
    ref(textarea)
    commentTextareaRef.current = textarea
  }

  function openImageDetailModal(i: number) {
    clickedImageNumber.current = i
    setIsImageDetailOpen(true)
  }

  function scrollIntoView(ref: HTMLElement | null, i: number) {
    if (clickedImageNumber.current === i) {
      ref?.scrollIntoView()
    }
  }

  useNeedToLogin()

  return (
    <PageHead title={`${post?.title ?? '건강문답'} - 알파카살롱`} description={description}>
      <FlexColumnGrow>
        <Padding />
        <FlexContainerBetweenCenter>
          <BackIcon onClick={goBack} />

          <ModificationButton onClick={goToPostUpdatePage} visible={nickname === author?.nickname}>
            <GreyWriteIcon />
            수정하기
          </ModificationButton>
        </FlexContainerBetweenCenter>

        {postLoading ? (
          <GridContainer>
            <Skeleton width="2.5rem" height="2.5rem" borderRadius="50%" />
            <GridGap>
              <Skeleton width="3.5rem" height="1rem" />
              <Skeleton width="5.5rem" height="1rem" />
            </GridGap>
          </GridContainer>
        ) : post ? (
          <GridContainer>
            <Image
              src={author?.imageUrl ?? '/images/default-profile-image.webp'}
              alt="profile"
              width="40"
              height="40"
              objectFit="cover"
              onClick={goToUserDetailPage}
            />
            <GridGap>
              <Link href={`/@${author?.nickname}`} passHref>
                <A disabled={!author}>
                  <H5>{author?.nickname ?? '탈퇴한 사용자'}</H5>
                </A>
              </Link>
              <GreyH5>{new Date(post.creationTime).toLocaleString()}</GreyH5>
            </GridGap>
          </GridContainer>
        ) : (
          '게시글 없음'
        )}

        {postLoading ? (
          <GridGap2>
            <Skeleton width="60%" height="1.5rem" />
            <GridGap>
              <Skeleton />
              <Skeleton width="90%" />
            </GridGap>
            <Frame16to11>
              <Skeleton height="100%" />
            </Frame16to11>
          </GridGap2>
        ) : post ? (
          <GridGap2>
            <h3>{post.title}</h3>
            <P>
              {(post.contents as string).split(/\n/).map((content, i) => (
                <Fragment key={i}>
                  <>{content}</>
                  <br />
                </Fragment>
              ))}
            </P>
            {post.imageUrls?.map((imageUrl, i) => (
              <Frame16to11DefaultImage key={i}>
                <Image
                  src={imageUrl}
                  alt="post image"
                  layout="fill"
                  objectFit="cover"
                  onClick={() => openImageDetailModal(i)}
                />
              </Frame16to11DefaultImage>
            ))}
            <Modal open={isImageDetailOpen} setOpen={setIsImageDetailOpen}>
              <Slider>
                {post.imageUrls?.map((imageUrl, i) => (
                  <Slide key={i} ref={(ref) => scrollIntoView(ref, i)}>
                    <Image
                      src={imageUrl}
                      alt="post image"
                      layout="fill"
                      objectFit="contain"
                      onClick={stopPropagationWhenImageClick}
                    />
                  </Slide>
                ))}
              </Slider>
            </Modal>
          </GridGap2>
        ) : (
          '게시글 없음'
        )}

        <HorizontalBorder />
        <GreyButton onClick={writeComment}>
          댓글 {commentCount ? `${commentCount}개` : '달기'}
        </GreyButton>
        <HorizontalBorder />

        <FlexBetween>
          <GridUl>
            {comments
              ? comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment as Comment}
                    setParentComment={setParentComment}
                    commentInputRef={commentTextareaRef}
                    newCommentId={newCommentId}
                  />
                ))
              : !commentsLoading && <GreyDiv>첫 번째로 댓글을 달아보세요</GreyDiv>}
            {commentsLoading && <CommentLoadingCard />}
          </GridUl>

          <StickyForm onSubmit={handleSubmit(createComment)}>
            {parentComment && (
              <Relative>
                <H4>
                  <PrimarySpan disabled={!parentComment.nickname}>
                    {parentComment.nickname}
                  </PrimarySpan>
                  님에게 답글다는 중
                </H4>
                <EllipsisText>{parentComment.contents}</EllipsisText>
                <XIcon onClick={resetParentComment} />
              </Relative>
            )}

            <CommentTextarea
              disabled={loading}
              onKeyDown={submitWhenShiftEnter}
              onInput={resizeTextareaHeight}
              placeholder={
                parentComment ? 'Shift+Enter로 답글 작성하기' : 'Shift+Enter로 댓글 작성하기'
              }
              ref={registerTextareaRef}
              {...registerCommentCreationForm}
            />
            {loading && (
              <Absolute>
                <LoadingSpinner />
              </Absolute>
            )}
            {contentsLineCount > 0 && (
              <CommentSubmitButton disabled={loading} type="submit">
                <Submit />
              </CommentSubmitButton>
            )}
          </StickyForm>
        </FlexBetween>
      </FlexColumnGrow>
    </PageHead>
  )
}
