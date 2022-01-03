import { useRouter } from 'next/router'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import PostCard from 'src/components/PostCard'
import {
  Post,
  useGroupQuery,
  useJoinGroupMutation,
  usePostsByGroupQuery,
} from 'src/graphql/generated/types-and-hooks'

const description = ''

export default function GroupDetailPage() {
  const router = useRouter()
  const groupId = (router.query.id ?? '') as string

  const { data: data2 } = useGroupQuery({
    onError: toastApolloError,
    skip: !groupId,
    variables: { id: groupId },
  })

  const { data } = usePostsByGroupQuery({
    onError: toastApolloError,
    skip: !groupId,
    variables: { groupId },
  })

  const [joinGroupMutataion, { loading }] = useJoinGroupMutation({
    onError: toastApolloError,
    refetchQueries: ['PostsByGroup'],
    update: (cache) => {
      cache.evict({ fieldName: 'myGroups' })
    },
  })

  const group = data2?.group
  const posts = data?.postsByGroup?.posts
  const isJoined = data?.postsByGroup?.isJoined

  return (
    <PageHead title=" - 알파카살롱" description={description}>
      <pre>{JSON.stringify(group, null, 2)}</pre>

      <h3>게시글</h3>

      {posts?.map((post) => (
        <PostCard key={post.id} post={post as Post} />
      ))}

      <button onClick={() => joinGroupMutataion({ variables: { id: groupId } })}>
        {isJoined ? '탈퇴하기' : '+ 이 그룹 가입하기'}
        {loading && '...'}
      </button>
    </PageHead>
  )
}
