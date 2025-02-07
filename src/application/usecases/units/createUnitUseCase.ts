import { IUnitRepository } from "../../../infrastructure/database/repositories/UnitRepository";

export const createUnitUseCase = async (
  name: string, 
  photo: string, 
  unitRepository: IUnitRepository, 
) => {

  const unit = await unitRepository.createUnit(name, photo);

  return {
    message: 'Unit Created',
    unit
    
  };

}


