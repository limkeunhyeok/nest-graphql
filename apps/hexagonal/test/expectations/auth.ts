export function expectTokenResponseSucceed(result) {
  expect(result).toHaveProperty('accessToken');
}
