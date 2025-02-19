import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const addDbvToUnitUseCase = async (
  unitId: string,
  userId: string,
  unitRepository: IUnitRepository, 
  userRepository: IUserRepository,
) => {

  if (!unitId) throw new Error('unitId is required');
  if (!userId) throw new Error('UseId is required');

  // Verifica se a unidade existe
  const unit = await unitRepository.getUnitById(unitId);
  if (!unit) {
    throw new Error('Unidade não encontrada.');
  }

  // Verifica se o usuário Existe e é dbv
  const user = await userRepository.findUserById(userId);
  if (!user || user.role !== 'dbv') {
    throw new Error('Usuário não é um dbv válido');
  }

  // Verifica se o usuário já é dbv dessa unidade
  const existingDBVActual = await unitRepository.existingDBVUnitActual(unitId, userId);
  if (existingDBVActual) {
    throw new Error('Usuário já é dbv desta unidade.');
  }

  // Verificar se já está em outra unidade
  const existingDBVOtherUnit = await unitRepository.existeDBVOtherUnit(userId);
  if (existingDBVOtherUnit) {
    throw new Error('Usuário já está em outra unidade');
  }


  const result = await unitRepository.addDbvToUnit(unitId, userId);
    if (!result) throw new Error("Error in add counselor");

  return {
    message: 'Dbv Add in Unit',
    result
  };

}


