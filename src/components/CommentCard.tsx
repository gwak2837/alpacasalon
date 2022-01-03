import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useState } from 'react'
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
  ALPACA_SALON_GREY_COLOR,
  ALPACA_SALON_RED_COLOR,
} from 'src/models/constants'
import { currentUser } from 'src/models/recoil'
import { A, GreyH5, GridGap, H5 } from 'src/pages/post/[id]'
import { Skeleton } from 'src/styles'
import HeartIcon from 'src/svgs/HeartIcon'
import { stopPropagation } from 'src/utils'
import styled, { css } from 'styled-components'

import LazyModal from './atoms/LazyModal'

const GridContainerComment = styled.ul`
  display: grid;
  gap: 1rem;
`

const GridLi = styled.li`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 0.9rem;
  align-items: center;

  position: relative;

  > span {
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
  padding-left: 4rem;
`

const ButtonCSS = css`
  border: none;
  border-radius: 99px;
  font-size: 0.75rem;
  padding: 0.4rem 0.75rem;
`

const LikingButton = styled.button`
  ${ButtonCSS}
  display: flex;
  align-items: center;
  gap: 0.4rem;

  background: ${(p) => (p.disabled ? '#eee' : ALPACA_SALON_BACKGROUND_COLOR)};
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};

  > svg {
    width: 0.8rem;
  }
`

const SubcommentButton = styled.button`
  ${ButtonCSS}
  background: ${(p) => (p.disabled ? '#eee' : ALPACA_SALON_BACKGROUND_COLOR)};
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
          <LikingButton disabled>
            <HeartIcon />
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
          <LikingButton disabled>
            <HeartIcon />
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
  scrollTo: any
  newCommentId: any
}

function SubcommentCard({ subcomment, scrollTo, newCommentId }: Props2) {
  const author = subcomment.user
  const contents = (subcomment.contents as string | null)?.split('\n')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { nickname } = useRecoilValue(currentUser)

  const [toggleLikingCommentMutation, { loading }] = useToggleLikingCommentMutation({
    onError: toastApolloError,
    variables: { id: subcomment.id },
  })

  const [deleteCommentMutation, { loading: isCommentDeletionLoading }] = useDeleteCommentMutation({
    onError: toastApolloError,
    refetchQueries: ['CommentsByPost'],
    variables: { id: subcomment.id },
  })

  function goToUserDetailPage() {
    if (author) {
      router.push(`/@${author.nickname}`)
    }
  }

  function toggleLikingComment() {
    toggleLikingCommentMutation()
  }

  function registerNewComment(newComment: HTMLLIElement) {
    if (newCommentId.current === subcomment.id) {
      scrollTo.current = newComment
    }
  }

  function openModal() {
    setIsModalOpen(true)
  }

  function deleteSubcomment() {
    deleteCommentMutation()
  }

  return (
    <GridLi ref={registerNewComment}>
      <Image
        src={/* author?.imageUrl  */ '/images/default-profile-image.webp'}
        alt="profile"
        width="40"
        height="40"
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
          <LikingButton disabled={loading} onClick={toggleLikingComment}>
            <HeartIcon selected={subcomment.isLiked} />
            공감해요
            <SelectableSpan selected={subcomment.isLiked}>{subcomment.likedCount}</SelectableSpan>
          </LikingButton>
        )}
      </GridItemDiv>
    </GridLi>
  )
}

type Props = {
  comment: Comment
  setParentComment: any
  commentInputRef: any
  scrollTo: any
  newCommentId: any
}

function CommentCard({
  comment,
  setParentComment,
  commentInputRef,
  scrollTo,
  newCommentId,
}: Props) {
  const author = comment.user
  const contents = (comment.contents as string | null)?.split('\n')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { nickname } = useRecoilValue(currentUser)

  const [toggleLikingCommentMutation, { loading }] = useToggleLikingCommentMutation({
    onError: toastApolloError,
    variables: { id: comment.id },
  })

  const [deleteCommentMutation, { loading: isCommentDeletionLoading }] = useDeleteCommentMutation({
    onError: toastApolloError,
    refetchQueries: ['CommentsByPost'],
    variables: { id: comment.id },
  })

  function goToUserDetailPage() {
    if (author) {
      router.push(`/@${author.nickname}`)
    }
  }

  function toggleLikingComment() {
    if (!loading) {
      toggleLikingCommentMutation()
    }
  }

  function setParentCommentInfo() {
    setParentComment({
      id: comment.id,
      nickname: author?.nickname ?? '탈퇴한 사용자',
      contents: comment.contents,
    })
    commentInputRef.current.focus()
  }

  function registerNewComment(newComment: HTMLLIElement) {
    if (newCommentId.current === comment.id) {
      scrollTo.current = newComment
    }
  }

  function openModal() {
    setIsModalOpen(true)
  }

  function deleteComment() {
    deleteCommentMutation()
  }

  return (
    <GridContainerComment>
      <GridLi ref={registerNewComment}>
        <Image
          src={/* author?.imageUrl */ '/images/default-profile-image.webp'}
          alt="profile"
          width="40"
          height="40"
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
              <>{content}</>
              <br />
            </Fragment>
          )) ?? <h6>삭제된 댓글입니다</h6>}
        </GridItemComment>

        {contents && (
          <GridItemDiv>
            <LikingButton onClick={toggleLikingComment}>
              <HeartIcon selected={comment.isLiked} />
              공감해요
              <SelectableSpan selected={comment.isLiked}>{comment.likedCount}</SelectableSpan>
            </LikingButton>
            <SubcommentButton onClick={setParentCommentInfo}>답글쓰기</SubcommentButton>
          </GridItemDiv>
        )}
      </GridLi>

      <GridContainerSubcomments>
        {comment.subcomments?.map((subcomment) => (
          <SubcommentCard
            key={subcomment.id}
            subcomment={subcomment}
            scrollTo={scrollTo}
            newCommentId={newCommentId}
          />
        ))}
      </GridContainerSubcomments>
    </GridContainerComment>
  )
}

export default CommentCard
