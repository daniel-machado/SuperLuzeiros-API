import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const updateUnitUseCase = async (
  unitId: string,
  name: string,
  photo: string,
  unitRepository: IUnitRepository, 
) => {

  if (!unitId) throw new Error('unitId is required');

  const unitUpdate = await unitRepository.updateUnit(unitId, name, photo);
    if (!unitUpdate) throw new Error("Unit not found!");

  return {
    message: 'Unit updated',
    unitUpdate
  };

}


