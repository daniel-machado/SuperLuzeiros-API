import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const addCounselorToUnitUseCase = async (
  unitId: string,
  userId: string,
  unitRepository: IUnitRepository, 
  userRepository: IUserRepository
) => {

  if (!unitId) throw new Error('unitId is required');
  if (!userId) throw new Error('UseId is required');

  // Verifica se a unidade existe
  const unit = await unitRepository.getUnitById(unitId);
  if (!unit) {
    throw new Error('Unidade não encontrada.');
  }

  // Verifica se o usuário Existe e é conselheiro
  const user = await userRepository.findUserById(userId);
  if (!user || user.role !== 'counselor') {
    throw new Error('Usuário não é um conselheiro válido');
  }

  // Verifica se o usuário já é conselheiro dessa unidade
  const existingCounselorActual = await unitRepository.existingCounselorUnitActual(unitId, userId);
  if (existingCounselorActual) {
    throw new Error('Usuário já é conselheiro desta unidade.');
  }

  // Verificar se já está em outra unidade
  const existingInOtherUnit = await unitRepository.existeOtherUnit(userId);
  if (existingInOtherUnit) {
    throw new Error('Usuário já está em outra unidade');
  }

  // Finalmente adiciona o conselheiro na unidade
  const result = await unitRepository.addCounselorToUnit(unitId, userId);
    if (!result) throw new Error("Error in add counselor");

  return {
    message: 'Counselor Add in Unit',
    result
  };

}


