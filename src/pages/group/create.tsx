import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import {
  CreateGroupMutationVariables,
  useCreateGroupMutation,
  useIsGroupNameUniqueLazyQuery,
} from 'src/graphql/generated/types-and-hooks'
import useNeedToLogin from 'src/hooks/useNeedToLogin'
import FileUploadIcon from 'src/svgs/file-upload.svg'
import XButtonIcon from 'src/svgs/x-button.svg'
import XIcon from 'src/svgs/x.svg'
import { isEmpty, uploadImageFiles } from 'src/utils'
import styled from 'styled-components'

import { Frame16to11 } from '../post/[id]'
import {
  AbsoluteH3,
  FileInput,
  GridContainer,
  Input,
  Textarea,
  GreyH3,
  StickyHeader,
  TransparentButton,
} from '../post/create'

type GroupCreationInput = {
  name: string
  description: string
}

const Div = styled.div`
  width: 100%;
  position: relative;

  > svg {
    position: absolute;
    width: 2.5rem;
    top: 0;
    right: 0;
    padding: 0.5rem;
  }
`

const FileInputLabel = styled.label<{ disabled?: boolean }>`
  position: relative;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem;
  padding: 1.5rem;

  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
`

const description = ''

export default function GroupCreationPage() {
  const [groupCreationLoading, setGroupCreationLoading] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const formData = useRef(globalThis.FormData ? new FormData() : null)
  const isGroupNameUniqueTimeout = useRef<any>(null)
  const router = useRouter()

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm<GroupCreationInput>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const [createGroupMutation] = useCreateGroupMutation({
    onCompleted: ({ createGroup }) => {
      if (createGroup) {
        toast.success('그룹을 만들었어요')
        router.back()
      }
    },
    onError: toastApolloError,
    update: (cache) => {
      cache.evict({ fieldName: 'recommendationGroups' })
      cache.evict({ fieldName: 'myGroups' })
    },
  })

  const [isGroupNameUniqueMutation, { loading }] = useIsGroupNameUniqueLazyQuery({
    onError: toastApolloError,
  })

  function goBack() {
    router.back()
  }

  function checkNameUniquenessDebouncly() {
    return new Promise<boolean | string>((resolve) => {
      clearTimeout(isGroupNameUniqueTimeout.current)
      isGroupNameUniqueTimeout.current = setTimeout(async () => {
        // Apollo Client 오류 해결되면 없애기
        await isGroupNameUniqueMutation({ variables: { name: getValues('name') } })

        const { data, variables } = await isGroupNameUniqueMutation({
          variables: { name: getValues('name') },
        })

        if (data?.isGroupNameUnique) {
          return resolve(true)
        } else {
          return resolve(`이미 사용 중인 닉네임이에요, ${variables?.name}`)
        }
      }, 500)
    })
  }

  function createPreviewImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (file && file.type.startsWith('image/') && formData.current) {
      formData.current.append('images', file)
      setPreviewImageUrl(URL.createObjectURL(file))
    }
  }

  function deletePreviewImage(e: any) {
    e.preventDefault()

    if (formData.current) {
      formData.current.delete('images')
      setPreviewImageUrl('')
    }
  }

  async function createGroup(input: GroupCreationInput) {
    setGroupCreationLoading(true)
    const variables: CreateGroupMutationVariables = { input }

    if (formData.current) {
      if (formData.current.has('images')) {
        const { imageUrls } = await uploadImageFiles(formData.current)
        variables.input.imageUrl = imageUrls[0]
      }
    }

    await createGroupMutation({ variables })
    setGroupCreationLoading(false)
  }

  useEffect(() => {
    if (errors.name || errors.description) {
      toast.warn(errors.name?.message ?? errors.description?.message)
    }
  }, [errors.description, errors.name])

  useNeedToLogin()

  return (
    <PageHead title="그룹 만들기 - 알파카살롱" description={description}>
      <form onSubmit={handleSubmit(createGroup)}>
        <StickyHeader>
          <XIcon onClick={goBack} />
          <AbsoluteH3>그룹 만들기</AbsoluteH3>
          <TransparentButton disabled={!isEmpty(errors) || groupCreationLoading} type="submit">
            완료
          </TransparentButton>
        </StickyHeader>

        <FileInputLabel disabled={groupCreationLoading} htmlFor="image">
          {previewImageUrl ? (
            <Div>
              <Frame16to11>
                <Image src={previewImageUrl} alt="group image" layout="fill" objectFit="cover" />
              </Frame16to11>
              <XButtonIcon onClick={deletePreviewImage} />
            </Div>
          ) : (
            <>
              <FileUploadIcon />
              <GreyH3>그룹 커버로 사용할 이미지를 선택해주세요</GreyH3>
            </>
          )}
          <FileInput
            accept="image/*"
            disabled={groupCreationLoading}
            id="image"
            onChange={createPreviewImage}
            type="file"
          />
        </FileInputLabel>

        <GridContainer>
          <Input
            id="name"
            disabled={groupCreationLoading}
            erred={Boolean(errors.name)}
            placeholder="그룹 이름을 적어주세요"
            {...register('name', {
              required: '그룹 이름을 작성한 후 완료를 눌러주세요',
              maxLength: {
                value: 20,
                message: '이름은 20자 이내로 입력해주세요',
              },
              validate: checkNameUniquenessDebouncly,
            })}
          />
          <Textarea
            id="description"
            placeholder="이 그룹에 대해 설명해 주세요"
            {...register('description', {
              required: '그룹 설명을 작성한 후 완료를 눌러주세요',
              maxLength: {
                value: 100,
                message: '설명은 100자 이내로 입력해주세요',
              },
            })}
          />
        </GridContainer>
      </form>
    </PageHead>
  )
}
