import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const getAllUnitUseCase = async (
  unitRepository: IUnitRepository, 
) => {

  const units = await unitRepository.getAllUnits();

  return {
    message: 'List Units',
    units
  };

}


