import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const removeCounselorFromUnitUseCase = async (
  unitId: string,
  userId: string,
  unitRepository: IUnitRepository, 
) => {

  if (!unitId) throw new Error('unitId is required');
  if (!userId) throw new Error('userId is required');

  const counselor = await unitRepository.existingCounselorUnitActual(unitId, userId);
  if(!counselor){
    throw new Error('Conselheiro não encontrado nesta unidade.')
  }

  const unitdelete = await unitRepository.removeCounselorFromUnit(userId);
    if (!unitdelete) throw new Error("Unit not found!");

  return {
    message: 'Counselor remove to Unit',
  };

}


