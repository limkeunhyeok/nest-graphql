import { MongoId } from 'src/@types/datatype';
import { SortOrder } from 'src/common/interfaces/sort.interface';
import { Role } from 'src/modules/users/entities/user.entity';

export const USER_FIELDS = `{
  _id,
  email,
  name,
  role,
  createdAt,
  updatedAt,
}`;

// create user
export const CREATE_USER_OPERATION = 'createUser';
export const CREATE_USER_QUERY = `mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) ${USER_FIELDS}
}`;
export const generateCreateUserInput = (
  email: string,
  password: string,
  name: string,
  role: Role,
) => ({
  createUserInput: {
    email,
    password,
    name,
    role,
  },
});

// update user
export const UPDATE_USER_OPERATION = 'updateUser';
export const UPDATE_USER_QUERY = `mutation UpdateUser($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) ${USER_FIELDS}
}`;
export const generateUpdateUserInput = (
  _id: MongoId,
  password: string,
  name: string,
) => ({
  updateUserInput: {
    _id,
    password,
    name,
  },
});

// delete user
export const DELETE_USER_OPERATION = 'deleteUser';
export const DELETE_USER_QUERY = `mutation DeleteUser($deleteUserId: String!) {
  deleteUser(userId: $deleteUserId) ${USER_FIELDS}
}`;
export const generateDeleteUserInput = (userId: MongoId) => ({
  deleteUserId: userId,
});

// paginate users
export const PAGINATE_USERS_FIELDS = `{
  total
  limit
  offset
  docs ${USER_FIELDS}
}`;
export const PAGINATE_USERS_OPERATION = 'paginateUsers';
export const PAGINATE_USERS_QUERY = `query PaginateUsers($readUserInput: ReadUserInput!) {
  paginateUsers(readUserInput: $readUserInput) ${PAGINATE_USERS_FIELDS}
}`;
export const generatePaginateUsersInput = ({
  _id,
  role,
  sortBy,
  sortOrder,
  limit,
  offset,
}: {
  _id?: MongoId;
  role?: Role;
  sortBy?: string;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}) => ({
  readUserInput: {
    _id,
    role,
    sortBy,
    sortOrder,
    limit,
    offset,
  },
});
