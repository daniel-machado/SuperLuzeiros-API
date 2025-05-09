// src/application/use-cases/auth/registerUseCase.ts
import { IUserAttributes } from "../../../infrastructure/database/models/User";
import { IHashingService } from "../../../infrastructure/hashing/hashingService";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import moment from "moment";
import { generateAccessToken, generateRefreshToken } from "../../services/tokenService";
import { IRefreshTokenRepository } from "../../../infrastructure/database/repositories/refreshTokenRepository";

export const signupUseCase = async (
  userData: IUserAttributes,
  userRepository: IUserRepository, 
  hashingService: IHashingService,
  refreshTokenRepository: IRefreshTokenRepository,
) => {

  const { name, birthDate, email, password, photoUrl } = userData;

  if (typeof userData !== "object" || userData === null) {
    throw new Error("Erro: userData não é um objeto válido!");
  }

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

  // const token = generateAccessToken(newUser)
  // const refreshToken = generateRefreshToken(newUser.id as string)

  // await refreshTokenRepository.create({
  //   token: refreshToken,
  //   userId: newUser.id as string,
  //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
  // })

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
    // token,
    // refreshToken
  };
};
