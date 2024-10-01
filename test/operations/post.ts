import { MongoId } from 'src/@types/datatype';
import { COMMENT_FIELDS } from './comment';
import { USER_FIELDS } from './user';

export const POST_FIELDS = `{
  _id
  authorId
  contents
  createdAt
  published
  title
  updatedAt
  comments ${COMMENT_FIELDS}
  author ${USER_FIELDS}
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

// get posts by query
export const GET_POSTS_BY_QUERY_OPERATION = 'getPostsByQuery';
export const GET_POSTS_BY_QUERY_QUERY = `query GetPostsByQuery($readPostInput: ReadPostInput!) {
  getPostsByQuery(readPostInput: $readPostInput) ${POST_FIELDS}
}`;
export const generateGetPostsByQueryInput = ({
  title,
  authorId,
  published,
}: {
  title?: string;
  authorId?: MongoId;
  published?: boolean;
}) => ({
  readPostInput: {
    title,
    authorId,
    published,
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
  deletePost(id: $deletePostId) ${POST_FIELDS}
}`;
export const generateDeletePostInput = (id: MongoId) => ({
  deletePostId: id,
});
