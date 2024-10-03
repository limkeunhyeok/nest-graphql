export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export interface SortQuery {
  sortBy: string;
  sortOrder: SortOrder;
}
