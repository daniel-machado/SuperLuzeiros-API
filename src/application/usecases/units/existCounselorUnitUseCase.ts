import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const existCounselorUnitUseCase = async (
  userId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!userId) throw new Error('UseId is required');

  // Verificar se já está em outra unidade
  const existingInOtherUnit = await unitRepository.existeOtherUnit(userId);

  return {
    message: 'Counselor Add in Unit',
    existingInOtherUnit
  };

}


