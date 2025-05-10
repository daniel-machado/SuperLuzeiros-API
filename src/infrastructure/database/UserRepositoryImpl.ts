// import User, { IUserAttributes } from '../../domain/entities/models/User';
// import { UserRepository } from '../../domain/repositories/userRepository'

// export class UserRepositoryImpl implements UserRepository {
//   async findUserByEmail(email: string): Promise<IUserAttributes | null> {
//     return User.findOne({ where: { email } });
//   }

//   async createUser(user: IUserAttributes): Promise<IUserAttributes> {
//     const newUser = await User.create(user);
//     return newUser.get({ plain: true });
//   }
// }
