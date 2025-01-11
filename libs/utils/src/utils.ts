import * as bcrypt from 'bcrypt';

export const isEmptyObject = (value: any): boolean => {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
};

export const isObject = (value: any): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const encryptPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const comparedPassword = (attemptPassword: string, password: string) => {
  return bcrypt.compareSync(attemptPassword, password);
};

export const sanitizeQuery = (
  query: Record<string, any>,
): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value !== undefined),
  );
};
