import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUserClass } from "../../../infrastructure/database/models/ClassUser";
import { IUserClassRepository } from "../../../infrastructure/database/repositories/UserClassRepository";
import { IClassRepository } from "../../../infrastructure/database/repositories/ClassRepository.ts";


export const createClassUserUseCase = async (
  data: IUserClass,
  userClassRepository: IUserClassRepository,
  userRepository: IUserRepository, 
  classRepository: IClassRepository
) => {

  const {userId, classId, assignedBy} = data;

  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error('Usuário não encontrado.');

  const classInfo = await classRepository.findById(classId);
  if (!classInfo) throw new Error('Classe não encontrada.');

  //IMPLEMENTAR ISSO AQUI DEPOIS 
  //if (user.age < classInfo.minAge) {
  //   throw new Error(`Usuário não tem idade suficiente para a classe ${classInfo.name}.`);
  // }

  const existingClass = await userClassRepository.findByUserAndClass(userId, classId);
  if (existingClass) {
    throw new Error("Esse usuário já tem essa Classe");
  }

  const newClass = await userClassRepository.create(data);

  return {
    newClass
  };
}
