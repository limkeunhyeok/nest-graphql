import { Role } from 'src/modules/users/entities/user.entity';

// create user
export const CREATE_USER_OPERATION = 'createUser';
export const CREATE_USER_QUERY = `mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    _id,
    email,
    password,
    name,
    role,
    createdAt,
    updatedAt,
  }
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
  updateUser(updateUserInput: $updateUserInput) {
    _id,
    email,
    password,
    name,
    role,
    createdAt,
    updatedAt,
  }
}`;
export const generateUpdateUserInput = (
  _id: string,
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
  deleteUser(id: $deleteUserId) {
    _id
    createdAt
    email
    name
    password
    role
    updatedAt
  }
}`;
export const generateDeleteUserInput = (id: string) => ({
  deleteUserId: id,
});

// get all users
export const GET_ALL_USERS_OPERATION = 'getAllUsers';
export const GET_ALL_USERS_QUERY = `query GetAllUsers {
  getAllUsers {
    _id
    createdAt
    email
    name
    password
    role
    updatedAt
  }
}`;

// get user by id
export const GET_USER_BY_ID_OPERATION = 'getUserById';
export const GET_USER_BY_ID_QUERY = `query GetUserById($getUserById: String!) {
  getUserById(id: $getUserById) {
    _id
    createdAt
    email
    name
    password
    role
    updatedAt
  }
}`;
export const generateGetUserByIdInput = (id: string) => ({
  getUserById: id,
});
