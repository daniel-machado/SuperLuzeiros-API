import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const existDbvUnitUseCase = async (
  userId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!userId) throw new Error('UseId is required');

  // Verificar se já está em outra unidade
  const existingInOtherUnit = await unitRepository.existeDBVOtherUnit(userId);

  return {
    message: 'Dbv Add in Unit',
    existingInOtherUnit
  };

}

