import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import {
  CreatePostMutationVariables,
  useCreatePostMutation,
  useMyGroupsInfoQuery,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import {
  ALPACA_SALON_COLOR,
  ALPACA_SALON_GREY_COLOR,
  ALPACA_SALON_RED_COLOR,
  TABLET_MIN_WIDTH,
} from 'src/models/constants'
import FileUploadIcon from 'src/svgs/file-upload.svg'
import XButtonIcon from 'src/svgs/x-button.svg'
import XIcon from 'src/svgs/x.svg'
import { isEmpty, submitWhenShiftEnter, uploadImageFiles } from 'src/utils'
import styled from 'styled-components'

import { Frame16to11 } from './[id]'

type PostCreationInput = {
  title: string
  contents: string
}

export type ImageInfo = {
  id: number
  url: string
}

export const AbsoluteH3 = styled.h3`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  max-width: ${TABLET_MIN_WIDTH};

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  border-bottom: 1px solid #e0e0e0;

  > svg {
    padding: 1rem;
    width: 3rem;
    cursor: pointer;
  }
`

export const TransparentButton = styled.button`
  background: none;
  color: ${(p) => (p.disabled ? '#888' : '#000')};
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem;
`

export const Input = styled.input<{ erred?: boolean }>`
  border: none;
  border-bottom: 2px solid ${(p) => (p.erred ? ALPACA_SALON_RED_COLOR : ALPACA_SALON_COLOR)};
  border-radius: 0;
  color: ${(p) => (p.disabled ? '#888' : '#000')};
  padding: 0.5rem 0;
  width: 100%;

  :focus {
    outline: none;
  }
`

export const GridContainer = styled.div`
  display: grid;
  gap: 1.5rem;

  padding: 2rem 0.5rem;
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 20vh;
  max-height: 50vh;
  padding: 0.5rem 0;
  color: ${(p) => (p.disabled ? '#888' : '#000')};

  :focus {
    outline: none;
  }
`

export const FileInput = styled.input`
  display: none;
`

export const FileInputLabel = styled.label<{ disabled?: boolean }>`
  position: relative;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`

export const GreyH3 = styled.h3`
  color: ${ALPACA_SALON_GREY_COLOR};
  text-align: center;
`

export const Slider = styled.ul<{ padding?: string }>`
  overflow-x: scroll;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;

  display: flex;
  padding: ${(p) => p.padding ?? 0};
`

export const Slide = styled.li<{ flexBasis: string }>`
  scroll-snap-align: center;

  aspect-ratio: 16 / 11;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  flex: 0 0 ${(p) => p.flexBasis};
  position: relative;
`

export const PreviewSlide = styled(Slide)`
  flex: 0 0 96%;
  padding: 0;

  > svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.5rem;
    padding: 0.5rem;
  }
`

function getGroupIdFromQueryString() {
  return globalThis.location
    ? new URLSearchParams(globalThis.location.search).get('groupId') ?? ''
    : ''
}

export function resizeTextareaHeight(e: KeyboardEvent<HTMLTextAreaElement>) {
  const eventTarget = e.target as HTMLTextAreaElement
  eventTarget.style.height = 'auto'
  eventTarget.style.height = `${eventTarget.scrollHeight}px`
}

const description = '알파카살롱에 글을 작성해보세요'

export default function PostCreationPage() {
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([])
  const [postCreationLoading, setPostCreationLoading] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState(getGroupIdFromQueryString())
  const formData = useRef(globalThis.FormData ? new FormData() : null)
  const imageId = useRef(0)
  const router = useRouter()

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PostCreationInput>({
    defaultValues: {
      title: '',
      contents: '',
    },
    reValidateMode: 'onBlur',
  })

  const [createPostMutation] = useCreatePostMutation({
    onCompleted: ({ createPost }) => {
      if (createPost) {
        toast.success('글을 작성했어요')
        router.back()
      }
    },
    onError: toastApolloError,
    update: (cache) => {
      cache.evict({ fieldName: 'posts' })
      if (selectedGroupId) {
        cache.evict({ fieldName: 'postsByGroup' })
      }
    },
  })

  const { data } = useMyGroupsInfoQuery({
    onError: toastApolloError,
  })

  const myGroups = data?.myGroups

  function goBack() {
    router.back()
  }

  function createPreviewImages(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0 && formData.current) {
      const newImageInfos: ImageInfo[] = []

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          newImageInfos.push({ id: imageId.current, url: URL.createObjectURL(file) })
          formData.current.append(`image${imageId.current}`, file)
          imageId.current++
        }
      }

      setImageInfos((prev) => [...prev, ...newImageInfos])
    }
  }

  function deletePreviewImage(imageId: number) {
    if (formData.current) {
      formData.current.delete(`image${imageId}`)
      setImageInfos((prevList) => prevList.filter((prev) => prev.id !== imageId))
    }
  }

  async function createPost(input: PostCreationInput) {
    setPostCreationLoading(true)
    const variables: CreatePostMutationVariables = { input }

    if (selectedGroupId) {
      variables.input.groupId = selectedGroupId
    }

    if (formData.current) {
      const files = [...formData.current.values()]

      if (files.length > 0) {
        const newFormData = new FormData()
        for (const file of files) {
          newFormData.append('images', file)
        }

        const { imageUrls } = await uploadImageFiles(newFormData)
        variables.input.imageUrls = imageUrls
      }
    }

    await createPostMutation({ variables })
    setPostCreationLoading(false)
  }

  useEffect(() => {
    if (errors.title || errors.contents) {
      toast.warn(errors.title?.message ?? errors.contents?.message)
    }
  }, [errors.contents, errors.title])

  // useNeedToLogin()

  return (
    <PageHead title="글쓰기 - 알파카살롱" description={description}>
      <form onSubmit={handleSubmit(createPost)}>
        <StickyHeader>
          <XIcon onClick={goBack} />
          <AbsoluteH3>글쓰기</AbsoluteH3>
          <TransparentButton disabled={!isEmpty(errors) || postCreationLoading} type="submit">
            완료
          </TransparentButton>
        </StickyHeader>

        <button
          onClick={(e) => {
            e.preventDefault()
            setSelectedGroupId('')
          }}
        >
          {!selectedGroupId && 'O '}
          전체 공개
        </button>
        {myGroups?.map((myGroup) => (
          <button
            key={myGroup.id}
            onClick={(e) => {
              e.preventDefault()
              if (selectedGroupId === myGroup.id) {
                setSelectedGroupId('')
              } else {
                setSelectedGroupId(myGroup.id)
              }
            }}
          >
            {selectedGroupId === myGroup.id && 'O '}
            {myGroup.name}
          </button>
        ))}

        <GridContainer>
          <Input
            disabled={postCreationLoading}
            erred={Boolean(errors.title)}
            placeholder="안녕하세요 우아한 알파카님. 평소에 궁금했던 것을 물어보세요."
            {...register('title', {
              required: '글 제목을 작성한 후 완료를 눌러주세요',
              maxLength: { value: 100, message: '제목은 100자 이내로 입력해주세요' },
            })}
          />
          <Textarea
            disabled={postCreationLoading}
            onKeyDown={submitWhenShiftEnter}
            onInput={resizeTextareaHeight}
            placeholder="Shift+Enter키로 글을 작성할 수 있어요"
            {...register('contents', { required: '글 내용을 작성한 후 완료를 눌러주세요' })}
          />
        </GridContainer>

        <Slider padding={imageInfos.length === 0 ? '0 1rem' : '0'}>
          {imageInfos.map((imageInfo) => (
            <PreviewSlide key={imageInfo.id} flexBasis="96%">
              <Frame16to11>
                <Image src={imageInfo.url} alt={imageInfo.url} layout="fill" objectFit="cover" />
              </Frame16to11>
              <XButtonIcon onClick={() => deletePreviewImage(imageInfo.id)} />
            </PreviewSlide>
          ))}
          <Slide flexBasis={imageInfos.length === 0 ? '100%' : '96%'}>
            <FileInputLabel disabled={postCreationLoading} htmlFor="images">
              <FileUploadIcon />
              <GreyH3>사진을 추가해주세요</GreyH3>
            </FileInputLabel>
            <FileInput
              accept="image/*"
              disabled={postCreationLoading}
              id="images"
              multiple
              onChange={createPreviewImages}
              type="file"
            />
          </Slide>
        </Slider>
      </form>
    </PageHead>
  )
}
