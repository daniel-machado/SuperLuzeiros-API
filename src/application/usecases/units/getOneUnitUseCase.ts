import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const getOneUnitUseCase = async (
  unitId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!unitId) throw new Error('unitId is required');

  const unit = await unitRepository.getUnitById(unitId);
    if (!unit) throw new Error("Unit not found!");

  return {
    message: 'Unit success',
    unit
  };

}


