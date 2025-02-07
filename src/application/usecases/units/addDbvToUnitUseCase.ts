import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const addDbvToUnitUseCase = async (
  unitId: string,
  userId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!unitId) throw new Error('unitId is required');
  if (!userId) throw new Error('UseId is required');

  const result = await unitRepository.addDbvToUnit(unitId, userId);
    if (!result) throw new Error("Error in add counselor");

  return {
    message: 'Dbv Add in Unit',
    result
  };

}


