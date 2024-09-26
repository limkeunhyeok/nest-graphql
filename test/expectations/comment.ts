export function expectCommentResponseSucceed(result) {
  expect(result).toHaveProperty('_id');
  expect(result).toHaveProperty('contents');
  expect(result).toHaveProperty('published');
  expect(result).toHaveProperty('authorId');
  expect(result).toHaveProperty('postId');
  expect(result).toHaveProperty('createdAt');
  expect(result).toHaveProperty('updatedAt');
}
