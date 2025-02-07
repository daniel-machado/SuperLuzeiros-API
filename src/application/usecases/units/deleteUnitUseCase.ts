import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const deleteUnitUseCae = async (
  unitId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!unitId) throw new Error('unitId is required');

  const unitdelete = await unitRepository.deleteUnit(unitId);
    if (!unitdelete) throw new Error("Unit not found!");

  return {
    message: 'Unit deleted',
  };

}


