import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const removeDbvFromUnitUseCase = async (
  userId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!userId) throw new Error('userId is required');

  const unitdelete = await unitRepository.removeDbvFromUnit(userId);
    if (!unitdelete) throw new Error("User not found!");

  return {
    message: 'Dbv remove to Unit',
  };

}


