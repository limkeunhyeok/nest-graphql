export function expectNotificationResponseSucceed(result) {
  expect(result).toHaveProperty('_id');
  expect(result).toHaveProperty('userId');
  expect(result).toHaveProperty('postId');
  expect(result).toHaveProperty('actorId');
  expect(result).toHaveProperty('commentId');
  expect(result).toHaveProperty('type');
  expect(result).toHaveProperty('isRead');
  expect(result).toHaveProperty('contents');
  expect(result).toHaveProperty('createdAt');
  expect(result).toHaveProperty('updatedAt');
}
