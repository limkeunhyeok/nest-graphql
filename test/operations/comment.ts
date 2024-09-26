import { MongoId } from 'src/@types/datatype';

// TODO: create comment
export const CREATE_COMMENT_OPERATION = 'createComment';
export const CREATE_COMMENT_QUERY = `mutation CreateComment($createCommentInput: CreateCommentInput!) {
  createComment(createCommentInput: $createCommentInput) {
    _id
    contents
    published
    authorId
    postId
    createdAt
    updatedAt
  }
}`;
export const generateCreateCommentInput = (
  contents: string,
  published: boolean,
  postId: MongoId,
) => ({
  createCommentInput: {
    contents,
    published,
    postId,
  },
});

// TODO: get comments by query
export const GET_COMMENTS_BY_QUERY_OPERATION = 'getCommentsByQuery';
export const GET_COMMENTS_BY_QUERY_QUERY = `query GetCommentsByQuery($readCommentInput: ReadCommentInput!) {
  getCommentsByQuery(readCommentInput: $readCommentInput) {
    _id
    contents
    published
    authorId
    postId
    createdAt
    updatedAt
  }
}`;
export const generateGetCommentsByQueryInput = ({
  published,
  authorId,
  postId,
}: {
  published?: boolean;
  authorId?: MongoId;
  postId?: MongoId;
}) => ({
  readCommentInput: {
    published,
    authorId,
    postId,
  },
});

// TODO: get comment by id
export const GET_COMMENT_BY_ID_OPERATION = 'getCommentById';
export const GET_COMMENT_BY_ID_QUERY = `query GetCommentById($getCommentById: String!) {
  getCommentById(id: $getCommentById) {
    _id
    contents
    published
    authorId
    postId
    createdAt
    updatedAt
  }
}`;
export const generateGetCommentByIdInput = (id: MongoId) => ({
  getCommentById: id,
});

// TODO: update comment
export const UPDATE_COMMENT_OPERATION = 'updateComment';
export const UPDATE_COMMENT_QUERY = `mutation UpdateComment($updateCommentInput: UpdateCommentInput!) {
  updateComment(updateCommentInput: $updateCommentInput) {
    _id
    contents
    published
    authorId
    postId
    createdAt
    updatedAt
  }
}`;
export const generateUpdateCommentInput = (
  contents: string,
  published: boolean,
  postId: MongoId,
  commentId: MongoId,
) => ({
  updateCommentInput: {
    contents,
    published,
    postId,
    commentId,
  },
});

// TODO: delete comment
export const DELETE_COMMENT_OPERATION = 'deleteComment';
export const DELETE_COMMENT_QUERY = `mutation DeleteComment($commentId: String!, $postId: String!) {
  deleteComment(commentId: $commentId, postId: $postId) {
    _id
    authorId
    contents
    createdAt
    postId
    published
    updatedAt
  }
}`;
export const generateDeleteCommentInput = (
  commentId: MongoId,
  postId: MongoId,
) => ({
  commentId,
  postId,
});
