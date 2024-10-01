import { MongoId } from 'src/@types/datatype';
import { Role } from 'src/modules/users/entities/user.entity';

export const USER_FIELDS = `{
  _id,
  email,
  password,
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
  deleteUser(id: $deleteUserId) ${USER_FIELDS}
}`;
export const generateDeleteUserInput = (id: MongoId) => ({
  deleteUserId: id,
});

// get users by query
export const GET_USERS_BY_QUERY_OPERATION = 'getUsersByQuery';
export const GET_USERS_BY_QUERY_QUERY = `query GetUsersByQuery($readUserInput: ReadUserInput!) {
  getUsersByQuery(readUserInput: $readUserInput) ${USER_FIELDS}
}`;
export const generateGetUsersByQueryInput = ({ role }: { role?: Role }) => ({
  readUserInput: {
    role,
  },
});
