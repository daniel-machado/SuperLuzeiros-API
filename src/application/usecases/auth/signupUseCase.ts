// src/application/use-cases/auth/registerUseCase.ts
import { IUserAttributes } from "../../../infrastructure/database/models/User";
import { IHashingService } from "../../../infrastructure/hashing/hashingService";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import moment from "moment";

// interface SigninInput {
//   name: string,
//   birthDate: Date; 
//   email: string, 
//   password: string,
//   confirmPassword: string,
//   photoUrl?: string, 
// }

export const signupUseCase = async (
  userData: IUserAttributes,
  userRepository: IUserRepository, 
  hashingService: IHashingService
): Promise<IUserAttributes> => {

  const { name, birthDate, email, password, photoUrl } = userData;

  // Verificar se o e-mail já está em uso
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash da senha
  const hashedPassword = await hashingService.hash(password, 12);

  // Criar o usuário
  const newUser = await userRepository.createUser({
    name,
    birthDate,
    email,
    password: hashedPassword,
    photoUrl,
    role: 'pending', // Status inicial
    isActive: false,
    isVerified: false,
  } as unknown as IUserAttributes);

  return {
    id: newUser.id, 
    name: newUser.name, 
    email: newUser.email,
    birthDate: newUser.birthDate,
    password: newUser.password,
    photoUrl: newUser.photoUrl,
    role: newUser.role,
    status: newUser.status,
    isActive: newUser.isActive,
    isVerified: newUser.isVerified,
  };
};
