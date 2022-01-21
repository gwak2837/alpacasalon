import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, memo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import {
  Comment,
  useDeleteCommentMutation,
  useToggleLikingCommentMutation,
  useUserByNicknameQuery,
} from 'src/graphql/generated/types-and-hooks'
import {
  ALPACA_SALON_BACKGROUND_COLOR,
  ALPACA_SALON_COLOR,
  ALPACA_SALON_DARK_GREY_COLOR,
  ALPACA_SALON_GREY_COLOR,
  ALPACA_SALON_RED_COLOR,
} from 'src/models/constants'
import { commentIdToMoveToAtom, currentUser } from 'src/models/recoil'
import { A, GreyH5, GridGap, H5 } from 'src/pages/post/[id]'
import { Skeleton } from 'src/styles'
import { stopPropagation } from 'src/utils'
import styled, { css } from 'styled-components'
import Arrow from 'src/svgs/subCommentArrow.svg'

import LazyModal from './atoms/LazyModal'

const GridContainerComment = styled.ul`
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`

const FlexContainer = styled.div`
  display: flex;
  gap: 2rem;
`

const GridLi = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 0.9rem;
  align-items: center;

  position: relative;

  > span {
    border-radius: 50%;
    cursor: pointer;
  }
`

const AbsoluteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;

  color: ${ALPACA_SALON_GREY_COLOR};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.3rem 0.3rem 0.5rem 0.5rem;
  transition: color 0.3s ease-out;

  :hover {
    color: ${ALPACA_SALON_RED_COLOR};
  }
`

const GridItemComment = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;

  line-height: 1.3rem;
  word-break: break-all;
`

const GridItemGap = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: grid;
  gap: 0.4rem;
`

const GridItemDiv = styled.div`
  grid-column: 2 / 3;
  grid-row: 3 / 4;

  display: flex;
  gap: 0.7rem;
`

const GridContainerSubcomments = styled.ul`
  display: grid;
  gap: 1rem;
`

const ButtonCSS = css`
  border: none;
  border-radius: 99px;
`

const LikingButton = styled.button<{ selected: boolean }>`
  ${ButtonCSS}
  display: flex;
  align-items: center;
  padding: 0;
  gap: 0.4rem;

  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};

  > svg {
    width: 0.8rem;
  }

  > span {
    color: ${(p) => (p.selected ? ALPACA_SALON_COLOR : ALPACA_SALON_DARK_GREY_COLOR)};
  }
`

const SubcommentButton = styled.button`
  ${ButtonCSS}
  color: ${ALPACA_SALON_DARK_GREY_COLOR};
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
`

const SelectableSpan = styled.span<{ selected?: boolean }>`
  color: ${(p) => (p.selected ? ALPACA_SALON_COLOR : '#626262')};
  font-weight: 600;
`

const WhiteBackground = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;

  display: grid;
  grid-template-columns: 1fr 1fr;
`

const GridItem = styled.div`
  display: grid;
  grid-column: 1 / 3;
  gap: 0.4rem;

  border-bottom: 1px solid rgba(60, 60, 67, 0.36);
  text-align: center;
  padding: 1.25rem 2rem;
`

const ModalP = styled.p`
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
`

const Button = styled.button`
  padding: 0.7rem;

  transition: background 0.3s ease-out;

  :hover {
    background: #eee;
  }
`

const RedButton = styled(Button)`
  border-left: 1px solid rgba(60, 60, 67, 0.36);
  color: ${ALPACA_SALON_RED_COLOR};
  font-weight: 600;
  font-size: 1.05rem;

  :hover {
    background: #fee;
  }
`

function SubcommentLoadingCard() {
  return (
    <GridContainerComment>
      <GridLi>
        <Skeleton width="2.5rem" height="2.5rem" borderRadius="50%" />
        <GridGap>
          <Skeleton width="3.5rem" height="1rem" />
          <Skeleton width="5.5rem" height="1rem" />
        </GridGap>

        <GridItemGap>
          <Skeleton height="1rem" />
          <Skeleton height="1rem" />
          <Skeleton width="80%" height="1rem" />
        </GridItemGap>

        <GridItemDiv>
          <LikingButton disabled selected={false}>
            공감해요
            <SelectableSpan>-</SelectableSpan>
          </LikingButton>
        </GridItemDiv>
      </GridLi>
    </GridContainerComment>
  )
}

export function CommentLoadingCard() {
  return (
    <GridContainerComment>
      <GridLi>
        <Skeleton width="2.5rem" height="2.5rem" borderRadius="50%" />
        <GridGap>
          <Skeleton width="3.5rem" height="1rem" />
          <Skeleton width="5.5rem" height="1rem" />
        </GridGap>

        <GridItemGap>
          <Skeleton height="1rem" />
          <Skeleton height="1rem" />
          <Skeleton width="80%" height="1rem" />
        </GridItemGap>

        <GridItemDiv>
          <LikingButton disabled selected={false}>
            공감해요
            <SelectableSpan>-</SelectableSpan>
          </LikingButton>
          <SubcommentButton disabled>답글쓰기</SubcommentButton>
        </GridItemDiv>
      </GridLi>

      <GridContainerSubcomments>
        <SubcommentLoadingCard />
        <SubcommentLoadingCard />
      </GridContainerSubcomments>
    </GridContainerComment>
  )
}

type Props2 = {
  subcomment: Comment
}

function SubcommentCard({ subcomment }: Props2) {
  const author = subcomment.user
  const contents = (subcomment.contents as string | null)?.split('\n')

  // Recoil
  const { nickname } = useRecoilValue(currentUser)

  // 클라이언트측 라우팅
  const router = useRouter()

  function goToUserDetailPage() {
    if (author) {
      router.push(`/@${author.nickname}`)
    }
  }

  // 댓글 좋아요 요청
  const [toggleLikingCommentMutation, { loading }] = useToggleLikingCommentMutation({
    onError: toastApolloError,
    variables: { id: subcomment.id },
  })

  function toggleLikingComment() {
    toggleLikingCommentMutation()
  }

  // 댓글 삭제 요청
  const [deleteCommentMutation, { loading: isCommentDeletionLoading }] = useDeleteCommentMutation({
    onError: toastApolloError,
    refetchQueries: ['CommentsByPost'],
    variables: { id: subcomment.id },
  })

  function deleteSubcomment() {
    deleteCommentMutation()
  }

  // 댓글로 이동하기
  const commentIdToMoveTo = useRecoilValue(commentIdToMoveToAtom)

  function registerNewComment(commentToMoveTo: HTMLLIElement | null) {
    if (commentIdToMoveTo === subcomment.id && commentToMoveTo) {
      commentToMoveTo.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  return (
    <FlexContainer>
      <Arrow />
      <GridLi ref={registerNewComment}>
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
          <GreyH5>{new Date(subcomment.creationTime).toLocaleTimeString()}</GreyH5>
        </GridGap>

        {contents && nickname === author?.nickname && (
          <>
            <AbsoluteButton disabled={isCommentDeletionLoading} onClick={openModal}>
              삭제
            </AbsoluteButton>
            <LazyModal open={isModalOpen} setOpen={setIsModalOpen}>
              <WhiteBackground>
                <GridItem onClick={stopPropagation}>
                  <h4>정말 이 답글을 삭제하시겠어요?</h4>
                  <ModalP>삭제한 답글은 다시 복구할 수 없어요</ModalP>
                </GridItem>
                <Button>취소</Button>
                <RedButton onClick={deleteSubcomment}>삭제</RedButton>
              </WhiteBackground>
            </LazyModal>
          </>
        )}

        <GridItemComment>
          {contents?.map((content, i) => (
            <Fragment key={i}>
              <>{content}</>
              <br />
            </Fragment>
          )) ?? <h6>삭제된 답글입니다</h6>}
        </GridItemComment>

        <GridItemDiv>
          {contents && (
            <LikingButton
              disabled={loading}
              onClick={toggleLikingComment}
              selected={subcomment.isLiked}
            >
              <span>공감해요</span>
              <SelectableSpan selected={subcomment.isLiked}>{subcomment.likedCount}</SelectableSpan>
            </LikingButton>
          )}
        </GridItemDiv>
      </GridLi>
    </FlexContainer>
  )
}

type Props = {
  comment: Commen
  setParentComment: any
  commentInputRef: any
}

function CommentCard({ comment, setParentComment, commentInputRef }: Props) {
  const author = comment.user
  const contents = (comment.contents as string | null)?.split('\n')

  // Recoil
  const { nickname } = useRecoilValue(currentUser)

  // 클라이언트측 라우팅
  const router = useRouter()

  function goToUserDetailPage() {
    if (author) {
      router.push(`/@${author.nickname}`)
    }
  }

  // 댓글 좋아요 요청
  const [toggleLikingCommentMutation, { loading }] = useToggleLikingCommentMutation({
    onError: toastApolloError,
    variables: { id: comment.id },
  })

  function toggleLikingComment() {
    if (!loading) {
      toggleLikingCommentMutation()
    }
  }

  // 댓글 삭제 요청
  const [deleteCommentMutation, { loading: isCommentDeletionLoading }] = useDeleteCommentMutation({
    onError: toastApolloError,
    refetchQueries: ['CommentsByPost'],
    variables: { id: comment.id },
  })

  function deleteComment() {
    deleteCommentMutation()
  }

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  // 댓글로 이동하기
  const commentIdToMoveTo = useRecoilValue(commentIdToMoveToAtom)

  function registerCommentToMoveTo(commentToMoveTo: HTMLLIElement | null) {
    if (commentIdToMoveTo === comment.id && commentToMoveTo) {
      commentToMoveTo.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // 기타
  function setParentCommentInfo() {
    setParentComment({
      id: comment.id,
      nickname: author?.nickname ?? '탈퇴한 사용자',
      contents: comment.contents,
    })
    commentInputRef.current.focus()
  }

  return (
    <GridContainerComment>
      <GridLi ref={registerCommentToMoveTo}>
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
          <GreyH5>{new Date(comment.creationTime).toLocaleString()}</GreyH5>
        </GridGap>

        {contents && nickname === author?.nickname && (
          <>
            <AbsoluteButton disabled={isCommentDeletionLoading} onClick={openModal}>
              삭제
            </AbsoluteButton>
            <LazyModal open={isModalOpen} setOpen={setIsModalOpen}>
              <WhiteBackground>
                <GridItem onClick={stopPropagation}>
                  <h4>정말 이 댓글을 삭제하시겠어요?</h4>
                  <ModalP>삭제한 댓글은 다시 복구할 수 없어요</ModalP>
                </GridItem>
                <Button>취소</Button>
                <RedButton onClick={deleteComment}>삭제</RedButton>
              </WhiteBackground>
            </LazyModal>
          </>
        )}

        <GridItemComment>
          {contents?.map((content, i) => (
            <Fragment key={i}>
              {content}
              <br />
            </Fragment>
          )) ?? <h6>삭제된 댓글입니다</h6>}
        </GridItemComment>

        {contents && (
          <GridItemDiv>
            <LikingButton onClick={toggleLikingComment} selected={comment.isLiked}>
              <span>공감해요</span>
              <SelectableSpan selected={comment.isLiked}>{comment.likedCount}</SelectableSpan>
            </LikingButton>
            <SubcommentButton onClick={setParentCommentInfo}>답글쓰기</SubcommentButton>
          </GridItemDiv>
        )}
      </GridLi>

      <GridContainerSubcomments>
        {comment.subcomments?.map((subcomment) => (
          <SubcommentCard key={subcomment.id} subcomment={subcomment} />
        ))}
      </GridContainerSubcomments>
    </GridContainerComment>
  )
}

export default memo(CommentCard)
