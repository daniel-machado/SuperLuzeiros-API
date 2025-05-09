
import { Request, Response } from 'express';

import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { unitRepository } from '../../infrastructure/database/repositories/UnitRepository';

// Use cases
import { approveUserUseCase } from '../../application/usecases/users/approveUserUseCase';
import { getAllUsersUseCase } from '../../application/usecases/users/getAllUsersUseCase';
import { pendingUserUseCase } from '../../application/usecases/users/pendingUsersUseCase';
import { FindMeUseCase } from '../../application/usecases/users/FindMeUserCase';


export const UserController = {

  // Get All Users
  async GetAllUsers(req: Request, res: Response): Promise<void> {
    try{
      const users = await getAllUsersUseCase(UserRepository) 
      res.status(201).json({ 
        success: true, 
        users
      });
    }catch (error){
      res.status(500).json({ success: false, error });
    }
  },

   //Pending Users - Usuários Pendentes
  async pendingUsers(req: Request, res: Response): Promise<void>  {
    try {
      const usersPending = await pendingUserUseCase(UserRepository);
      res.status(201).json({ 
        success: true, 
        usersPending
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  },

  //approveUser - Aprovação de User
  async approveUser(req: Request, res: Response): Promise<void>  {
    const { userId } = req.params;
    const { role, unitId } = req.body;
    
    try {
      const result = await approveUserUseCase(
        userId, 
        role, 
        unitId, 
        UserRepository,
        unitRepository
      );
      res.status(201).json({ 
        success: true, 
        result
      });
    } catch (error: any) {
      console.error("Error approving user:", error);
      res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });

    }
  },

  // Buscar Usuário Logado
  async me(req: Request, res: Response): Promise<void> {  
    try {
      const userId = req.user?.userId; // Alterado para `userId`, já que no token é esse campo
      if (!userId) {
        res.status(401).json({ success: false, message: "Usuário não autenticado" });
        return;
      }
      const user = await FindMeUseCase(userId, UserRepository);
      if (!user) {
        res.status(404).json({ success: false, message: "Usuário não encontrado" });
        return;
      }
      res.status(200).json({ 
        success: true, 
        message: 'Dados do Usuário',
        user
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro interno no servidor' });
    }
  },  
}