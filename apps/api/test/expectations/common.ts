export function expectUpdateManyResultResponseSucceed(result) {
  expect(result).toHaveProperty('successIds');
  expect(result).toHaveProperty('failedIds');
  expect(result).toHaveProperty('totalProcessed');
}
