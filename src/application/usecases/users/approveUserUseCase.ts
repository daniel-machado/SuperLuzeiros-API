
import { IUserAttributes } from '../../../infrastructure/database/models/User';
import { IUnitRepository } from '../../../infrastructure/database/repositories/UnitRepository';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository';

interface result {
  user: IUserAttributes,
}

export const approveUserUseCase = async (
  userId: string,
  role: 'pending'| 'admin' | 'dbv'| 'director' | 'lead' | 'counselor' |'secretary',
  unitId: string,
  userRepository: IUserRepository,
  unitRepository: IUnitRepository,
): Promise<result> => {

  // Verificar se o usuário existe
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('User does not exist!');
  }

  // Verifica se o status do usuário é pendente mesmo
  if (!user || user.status !== 'pending') {
    throw new Error('User not in pending status');
  }

  // Se for 'dbv', precisa de uma unidade
  if (role === 'dbv') {
    if(!unitId){
      throw new Error ('Unit must be provided for dbv role');
    }
    
    // Verifica se a unidade existe
    const unit = await unitRepository.getUnitById(unitId);
    if (!unit) {
      throw new Error('Unit does not exist!');
    }
    // Atualiza usuário com unidade
    await userRepository.updateUser(userId, { role, status: 'approved' }, unitId);
  } else {
    // Apenas aprova sem unidade
    await userRepository.updateUser(userId, { role, status: 'approved' });
  }

  return {
    user
  };
}