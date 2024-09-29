export function expectPostResponseSucceed(result) {
  expect(result).toHaveProperty('_id');
  expect(result).toHaveProperty('title');
  expect(result).toHaveProperty('contents');
  expect(result).toHaveProperty('published');
  expect(result).toHaveProperty('authorId');
  expect(result).toHaveProperty('author');
  // expect(result).toHaveProperty('comments');
  expect(result).toHaveProperty('createdAt');
  expect(result).toHaveProperty('updatedAt');
}
