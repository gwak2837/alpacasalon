import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import {
  UpdatePostMutationVariables,
  usePostQuery,
  useUpdatePostMutation,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import { currentUser } from 'src/models/recoil'
import FileUploadIcon from 'src/svgs/file-upload.svg'
import XButtonIcon from 'src/svgs/x-button.svg'
import XIcon from 'src/svgs/x.svg'
import { isArrayEqual, isEmpty, submitWhenShiftEnter, uploadImageFiles } from 'src/utils'

import {
  AbsoluteH3,
  FileInput,
  FileInputLabel,
  GreyH3,
  GridContainer,
  ImageInfo,
  Input,
  PreviewSlide,
  Slide,
  Slider,
  StickyHeader,
  Textarea,
  TransparentButton,
  resizeTextareaHeight,
} from '../create'
import { Frame16to11 } from '.'

type PostUpdateInput = {
  title: string
  contents: string
}

type PreviousPostData = {
  title: string
  contents: string
  imageUrls?: string[] | null
}

const description = '알파카살롱에 글을 작성해보세요'

export default function PostUpdatePage() {
  const [oldImageInfos, setOldImageInfos] = useState<ImageInfo[]>([])
  const [newImageInfos, setNewImageInfos] = useState<ImageInfo[]>([])
  const [isPostUpdateLoading, setIsPostUpdateLoading] = useState(false)
  const formData = useRef(globalThis.FormData ? new FormData() : null)
  const imageId = useRef(0)
  const prevPostData = useRef<PreviousPostData>()
  const { nickname } = useRecoilValue(currentUser)
  const router = useRouter()
  const postId = (router.query.id ?? '') as string

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<PostUpdateInput>({
    defaultValues: {
      title: '',
      contents: '',
    },
    reValidateMode: 'onBlur',
  })

  const { loading: isPostLoading } = usePostQuery({
    onCompleted: ({ post }) => {
      if (post) {
        prevPostData.current = {
          title: post.title,
          contents: post.contents,
          imageUrls: post.imageUrls,
        }

        setValue('title', post.title)
        setValue('contents', post.contents)

        if (post.imageUrls) {
          const imageInfos = []
          for (const imageUrl of post.imageUrls) {
            imageInfos.push({ id: imageId.current, url: imageUrl })
            imageId.current++
          }
          setOldImageInfos(imageInfos)
        }
      }
    },
    onError: toastApolloError,
    skip: !postId || !nickname,
    variables: { id: postId },
  })

  const [updatePostMutation] = useUpdatePostMutation({
    onCompleted: ({ updatePost }) => {
      if (updatePost) {
        toast.success('글을 수정했어요')
        router.back()
      }
    },
    onError: toastApolloError,
  })

  function goBack() {
    router.back()
  }

  function createPreviewImages(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0 && formData.current) {
      const newImageUrls: ImageInfo[] = []

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          newImageUrls.push({ id: imageId.current, url: URL.createObjectURL(file) })
          formData.current.append(`image${imageId.current++}`, file)
          imageId.current++
        }
      }

      setNewImageInfos((prev) => [...prev, ...newImageUrls])
    }
  }

  function deleteOldPreviewImage(imageId: number) {
    if (formData.current) {
      setOldImageInfos((prevList) => prevList.filter((prev) => prev.id !== imageId))
    }
  }

  function deleteNewPreviewImage(imageId: number) {
    if (formData.current) {
      formData.current.delete(`image${imageId}`)
      setNewImageInfos((prevList) => prevList.filter((prev) => prev.id !== imageId))
    }
  }

  async function updatePost(postUpdateInput: PostUpdateInput) {
    if (
      prevPostData.current?.title === postUpdateInput.title &&
      prevPostData.current?.contents === postUpdateInput.contents &&
      isArrayEqual(prevPostData.current?.imageUrls, oldImageInfos)
    )
      return

    setIsPostUpdateLoading(true)
    const variables: UpdatePostMutationVariables = {
      input: {
        id: postId,
      },
    }

    const input = variables.input

    if (prevPostData.current?.title !== postUpdateInput.title) {
      input.title = postUpdateInput.title
    }

    if (prevPostData.current?.contents !== postUpdateInput.contents) {
      input.contents = postUpdateInput.contents
    }

    if (!isArrayEqual(prevPostData.current?.imageUrls, oldImageInfos)) {
      input.imageUrls = []
      input.imageUrls.push(...oldImageInfos.map((imageInfo) => imageInfo.url))
    }

    if (formData.current) {
      const files = [...formData.current.values()]

      if (files.length > 0) {
        const newFormData = new FormData()
        for (const file of files) {
          newFormData.append('images', file)
        }

        const { imageUrls } = await uploadImageFiles(newFormData)
        if (!input.imageUrls) input.imageUrls = []
        input.imageUrls.push(...imageUrls)
      }
    }

    // console.log(variables)
    await updatePostMutation({ variables })
    setIsPostUpdateLoading(false)
  }

  useEffect(() => {
    if (errors.title || errors.contents) {
      toast.warn(errors.title?.message ?? errors.contents?.message)
    }
  }, [errors.contents, errors.title])

  useNeedToLogin()

  return (
    <PageHead title="글 수정하기 - 알파카살롱" description={description}>
      <form onSubmit={handleSubmit(updatePost)}>
        <StickyHeader>
          <XIcon onClick={goBack} />
          <AbsoluteH3>수정하기</AbsoluteH3>
          <TransparentButton
            disabled={isPostLoading || !isEmpty(errors) || isPostUpdateLoading}
            type="submit"
          >
            완료
          </TransparentButton>
        </StickyHeader>

        <GridContainer>
          <Input
            disabled={isPostLoading || isPostUpdateLoading}
            erred={Boolean(errors.title)}
            placeholder="안녕하세요 우아한 알파카님. 평소에 궁금했던 것을 물어보세요."
            {...register('title', { required: '글 제목을 작성한 후 완료를 눌러주세요' })}
          />
          <Textarea
            disabled={isPostLoading || isPostUpdateLoading}
            onKeyDown={submitWhenShiftEnter}
            onInput={resizeTextareaHeight}
            placeholder="Shift+Enter키로 글을 작성할 수 있어요"
            {...register('contents', { required: '글 내용을 작성한 후 완료를 눌러주세요' })}
          />
        </GridContainer>

        <Slider padding={oldImageInfos.length === 0 && newImageInfos.length === 0 ? '0 1rem' : '0'}>
          {oldImageInfos.map((imageInfo) => (
            <PreviewSlide key={imageInfo.id} flexBasis="96%">
              <Frame16to11>
                <Image src={imageInfo.url} alt={imageInfo.url} layout="fill" objectFit="cover" />
              </Frame16to11>
              <XButtonIcon onClick={() => deleteOldPreviewImage(imageInfo.id)} />
            </PreviewSlide>
          ))}
          {newImageInfos.map((imageInfo) => (
            <PreviewSlide key={imageInfo.id} flexBasis="96%">
              <Frame16to11>
                <Image src={imageInfo.url} alt={imageInfo.url} layout="fill" objectFit="cover" />
              </Frame16to11>
              <XButtonIcon onClick={() => deleteNewPreviewImage(imageInfo.id)} />
            </PreviewSlide>
          ))}
          <Slide
            flexBasis={oldImageInfos.length === 0 && newImageInfos.length === 0 ? '100%' : '96%'}
          >
            <FileInputLabel disabled={isPostLoading || isPostUpdateLoading} htmlFor="images">
              <FileUploadIcon />
              <GreyH3>사진을 추가해주세요</GreyH3>
            </FileInputLabel>
            <FileInput
              accept="image/*"
              disabled={isPostLoading || isPostUpdateLoading}
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
