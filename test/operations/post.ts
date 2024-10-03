import { MongoId } from 'src/@types/datatype';
import { SortOrder } from 'src/common/interfaces/sort.interface';

export const POST_FIELDS = `{
  _id
  authorId
  contents
  createdAt
  published
  title
  updatedAt
}`;

// create post
export const CREATE_POST_OPERATION = 'createPost';
export const CREATE_POST_QUERY = `mutation CreatePost($createPostInput: CreatePostInput!) {
  createPost(createPostInput: $createPostInput) ${POST_FIELDS}
}`;
export const generateCreatePostInput = (
  title: string,
  contents: string,
  published: boolean,
) => ({
  createPostInput: {
    title,
    contents,
    published,
  },
});

// paginate posts
export const PAGINATE_POSTS_FIELDS = `{
  total
  limit
  offset
  docs ${POST_FIELDS}
}`;
export const PAGINATE_POSTS_OPERATION = 'paginatePosts';
export const PAGINATE_POSTS_QUERY = `query PaginatePosts($readPostInput: ReadPostInput!) {
  paginatePosts(readPostInput: $readPostInput) ${PAGINATE_POSTS_FIELDS}
}`;
export const generatePaginatePostsInput = ({
  _id,
  published,
  authorId,
  sortBy,
  sortOrder,
  limit,
  offset,
}: {
  _id?: MongoId;
  authorId?: MongoId;
  published?: boolean;
  sortBy?: string;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}) => ({
  readPostInput: {
    _id,
    published,
    authorId,
    sortBy,
    sortOrder,
    limit,
    offset,
  },
});

// update post
export const UPDATE_POST_OPERATION = 'updatePost';
export const UPDATE_POST_QUERY = `mutation UpdatePost($updatePostInput: UpdatePostInput!) {
  updatePost(updatePostInput: $updatePostInput) ${POST_FIELDS}
}`;
export const generateUpdatePostInput = (
  postId: MongoId,
  title: string,
  contents: string,
  published: boolean,
) => ({
  updatePostInput: {
    postId,
    title,
    contents,
    published,
  },
});

// delete post
export const DELETE_POST_OPERATION = 'deletePost';
export const DELETE_POST_QUERY = `mutation DeletePost($deletePostId: String!) {
  deletePost(postId: $deletePostId) ${POST_FIELDS}
}`;
export const generateDeletePostInput = (postId: MongoId) => ({
  deletePostId: postId,
});
