export function expectUserResponseSucceed(result) {
  expect(result).toHaveProperty('_id');
  expect(result).toHaveProperty('email');
  expect(result).toHaveProperty('name');
  expect(result).toHaveProperty('role');
  expect(result).toHaveProperty('createdAt');
  expect(result).toHaveProperty('updatedAt');
}
