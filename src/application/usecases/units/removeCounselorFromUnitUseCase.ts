import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const removeCounselorFromUnitUseCase = async (
  unitId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!unitId) throw new Error('unitId is required');

  const unitdelete = await unitRepository.removeCounselorFromUnit(unitId);
    if (!unitdelete) throw new Error("Unit not found!");

  return {
    message: 'Counselor remove to Unit',
  };

}


