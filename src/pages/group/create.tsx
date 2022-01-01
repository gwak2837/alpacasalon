import PageHead from 'src/components/PageHead'
import FileUploadIcon from 'src/svgs/file-upload.svg'
import styled from 'styled-components'

import { FileInput, GreyH3 } from '../post/create'

const FileInputLabel = styled.label``

const description = ''

export default function GroupCreationPage() {
  return (
    <PageHead title="그룹 생성하기 - 알파카살롱" description={description}>
      <div>그룹 만들기</div>
      <FileInputLabel /* disabled={false} */ htmlFor="image">
        <FileUploadIcon />
        <GreyH3>그룹 커버로 사용할 이미지를 올려주세요</GreyH3>
      </FileInputLabel>
      <FileInput
        accept="image/*"
        disabled={false}
        id="image"
        multiple
        // onChange={createPreviewImages}
        type="file"
      />

      <label htmlFor="name">그룹 이름</label>
      <input id="name" />

      <label htmlFor="description">그룹 설명</label>
      <input id="description" />
    </PageHead>
  )
}
