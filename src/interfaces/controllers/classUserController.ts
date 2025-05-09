import { Request, Response } from 'express';

import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { UserClassRepository } from '../../infrastructure/database/repositories/UserClassRepository';
import { ClassRepository } from '../../infrastructure/database/repositories/ClassRepository.ts';

// Use Cases
import { createClassUserUseCase } from '../../application/usecases/ClassUser/createClassUserUseCase';
import { updateClassUserUseCase } from '../../application/usecases/ClassUser/updateClassUserUseCase';
import { deleteClassUserUseCase } from '../../application/usecases/ClassUser/deleteClassUserUseCase';
import { getAllClassUserUseCase } from '../../application/usecases/ClassUser/getAllClassUserUseCase';
import { getByIdClassUserUseCase } from '../../application/usecases/ClassUser/getByIdClassUserUseCase';
import { getByUserAndClassUserUseCase } from '../../application/usecases/ClassUser/getByUserAndClassUserUseCase';
import { getAllByUserClassUserUseCase } from '../../application/usecases/ClassUser/getAllByUserClassUserUseCase';
import { getAllByClassUserUseCase } from '../../application/usecases/ClassUser/getAllByClassUserUseCase';

export const ClassUserController = {

  async create(req: Request, res: Response): Promise<void>  {
    const { userId, classId, assignedBy } = req.body;
    try {
    
      if (!userId || !classId || !assignedBy) {
        res.status(400).json({ message: 'Campos obrigatórios faltando' });
        return
      }

      const result = await createClassUserUseCase( 
        {userId, classId, assignedBy},  
        UserClassRepository, 
        UserRepository,
        ClassRepository
        
      );
      res.status(201).json({
        success: true,
        message: 'Classe atribuída com sucesso',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const { userId, classId, assignedBy } = req.body;
    try {
      const result = await updateClassUserUseCase( 
        id, 
        {userId, classId, assignedBy}, 
        UserClassRepository
      );
      res.status(201).json({
        success: true,
        message: 'Especialidade atualizada com sucesso',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteClassUserUseCase(id, UserClassRepository);
      res.status(204).json({ success: true, message: 'deleted'});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const result = await getAllClassUserUseCase(UserClassRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getOneById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params
    try {
      const result = await getByIdClassUserUseCase(id, UserClassRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByUserAndClass(req: Request, res: Response): Promise<void>  {
    const { userId, classId } = req.body
    try {
      const result = await getByUserAndClassUserUseCase(userId, classId, UserClassRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllByUser(req: Request, res: Response): Promise<void>  {
    const { userId } = req.params
    try {
      const result = await getAllByUserClassUserUseCase(userId, UserClassRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllByClass(req: Request, res: Response): Promise<void>  {
    const { classId } = req.body
    try {
      const result = await getAllByClassUserUseCase(classId, UserClassRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
}