import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const removeDbvFromUnitUseCase = async (
  unitId: string,
  userId: string,
  unitRepository: IUnitRepository, 
  userRepository: IUserRepository,
) => {

  if (!unitId) throw new Error('unitId is required');
  if (!userId) throw new Error('userId is required');

  const dbv = await unitRepository.existingDBVUnitActual(unitId, userId);
  if(!dbv){
    throw new Error('DBV não encontrado nesta unidade.')
    
  }

  const dbvRemove = await unitRepository.removeDbvFromUnit(unitId, userId);
    if (!dbvRemove){ 
      throw new Error("User not found!");
    }

    await userRepository.updateUser(userId, { status: 'pending' });

  return {
    message: 'Dbv remove to Unit',
  };

}


