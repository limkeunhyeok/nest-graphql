export interface PaginateResponse<T> {
  total: number;
  limit: number;
  offset: number;
  docs: T[];
}

export const paginateResponse = <T>({
  total,
  limit,
  offset,
  docs,
}: PaginateResponse<T>) => {
  if (offset >= total) {
    return {
      total,
      limit: 0,
      offset,
      docs,
    };
  }

  return {
    total,
    limit: offset + limit > total ? total - offset : limit,
    offset,
    docs,
  };
};
