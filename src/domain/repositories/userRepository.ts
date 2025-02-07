import { IUserAttributes } from '../entities/models/User';

export interface UserRepository {
  findUserByEmail(email: string): Promise<IUserAttributes | null>;
  createUser(user: IUserAttributes): Promise<IUserAttributes>;
}

// import { User } from '../entities/User';

// export interface UserRepository {
//   createUser(user: User): Promise<User>;
//   getUserByEmail(email: string): Promise<User | null>;
//   getUserById(id: string): Promise<User | null>;
//   updateUser(user: User): Promise<User>;
//   deleteUser(id: string): Promise<void>;
// }
