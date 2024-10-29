import { MongoId } from '@common/core/@types/datatype';
import { SortOrder } from '@common/core/interfaces/sort.interface';

export const COMMENT_FIELDS = `{
  _id
  contents
  published
  authorId
  postId
  createdAt
  updatedAt
}`;

// create comment
export const CREATE_COMMENT_OPERATION = 'createComment';
export const CREATE_COMMENT_QUERY = `mutation CreateComment($createCommentInput: CreateCommentInput!) {
  createComment(createCommentInput: $createCommentInput) ${COMMENT_FIELDS}
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

// paginate comments
export const PAGINATE_COMMENTS_FIELDS = `{
  total
  limit
  offset
  docs ${COMMENT_FIELDS}
}`;
export const PAGINATE_COMMENTS_OPERATION = 'paginateComments';
export const PAGINATE_COMMENTS_QUERY = `query PaginateComments($readCommentInput: ReadCommentInput!) {
  paginateComments(readCommentInput: $readCommentInput) ${PAGINATE_COMMENTS_FIELDS}
}`;
export const generatePaginateCommentsInput = ({
  _id,
  published,
  authorId,
  postId,
  sortBy,
  sortOrder,
  limit,
  offset,
}: {
  _id?: MongoId;
  published?: boolean;
  authorId?: MongoId;
  postId?: MongoId;
  sortBy?: string;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}) => ({
  readCommentInput: {
    _id,
    published,
    authorId,
    postId,
    sortBy,
    sortOrder,
    limit,
    offset,
  },
});

// update comment
export const UPDATE_COMMENT_OPERATION = 'updateComment';
export const UPDATE_COMMENT_QUERY = `mutation UpdateComment($updateCommentInput: UpdateCommentInput!) {
  updateComment(updateCommentInput: $updateCommentInput) ${COMMENT_FIELDS}
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

// delete comment
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
