import { MongoId } from 'src/@types/datatype';

// create post
export const CREATE_POST_OPERATION = 'createPost';
export const CREATE_POST_QUERY = `mutation CreatePost($createPostInput: CreatePostInput!) {
  createPost(createPostInput: $createPostInput) {
    _id
    authorId
    contents
    published
    title
    createdAt
    updatedAt
  }
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
  getPostsByQuery(readPostInput: $readPostInput) {
    _id
    authorId
    contents
    published
    title
    createdAt
    updatedAt
  }
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

// get post by id
export const GET_POST_BY_ID_OPERATION = 'getPostById';
export const GET_POST_BY_ID_QUERY = `query GetPostById($getPostById: String!) {
  getPostById(id: $getPostById) {
    _id
    authorId
    contents
    published
    title
    createdAt
    updatedAt
  }
}`;
export const generateGetPostByIdInput = (id: string) => ({
  getPostById: id,
});

// update post
export const UPDATE_POST_OPERATION = 'updatePost';
export const UPDATE_POST_QUERY = `mutation UpdatePost($updatePostInput: UpdatePostInput!) {
  updatePost(updatePostInput: $updatePostInput) {
    _id
    authorId
    contents
    published
    title
    createdAt
    updatedAt
  }
}`;
export const generateUpdatePostInput = (
  _id: MongoId,
  title: string,
  contents: string,
  published: boolean,
) => ({
  updatePostInput: {
    _id,
    title,
    contents,
    published,
  },
});

// delete post
export const DELETE_POST_OPERATION = 'deletePost';
export const DELETE_POST_QUERY = `mutation DeletePost($deletePostId: String!) {
  deletePost(id: $deletePostId) {
    _id
    authorId
    contents
    createdAt
    published
    title
    updatedAt
  }
}`;
export const generateDeletePostInput = (id: string) => ({
  deletePostId: id,
});
