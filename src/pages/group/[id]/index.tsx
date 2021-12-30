import { useRouter } from 'next/router'
import { toastApolloError } from 'src/apollo/error'
import PageHead from 'src/components/PageHead'
import PostCard from 'src/components/PostCard'
import {
  Post,
  useJoinGroupMutation,
  usePostsByGroupQuery,
} from 'src/graphql/generated/types-and-hooks'

const description = ''

export default function GroupDetailPage() {
  const router = useRouter()
  const groupId = (router.query.id ?? '') as string

  const { data } = usePostsByGroupQuery({
    onError: toastApolloError,
    skip: !groupId,
    variables: { groupId },
  })

  const [joinGroupMutataion, { loading }] = useJoinGroupMutation({
    onError: toastApolloError,
    onQueryUpdated: (observableQuery) => {
      observableQuery.refetch()
    },
    refetchQueries: ['MyGroupsInfo', 'PostsByGroup'],
  })

  const posts = data?.postsByGroup?.posts
  const isJoined = data?.postsByGroup?.isJoined

  return (
    <PageHead title=" - 알파카살롱" description={description}>
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
