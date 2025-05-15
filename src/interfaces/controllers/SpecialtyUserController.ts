import { Request, Response } from 'express';

import { unitRepository } from '../../infrastructure/database/repositories/UnitRepository';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { UserSpecialtyRepository } from '../../infrastructure/database/repositories/UserSpecialtyRepository';

// Use Cases
import { approvedSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/approvedSpecialtyUserUseCase';
import { rejectedSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/rejectedSpecialtyUserUseCase';
import { createSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/createSpecialtyUserUseCase';
import { updateSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/updateSpecialtyUserUseCase';
import { deleteSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/deleteSpecialtyUserUseCase';
import { getAllSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/getAllSpecialtyUserUseCase';
import { getByIdSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/getByIdSpecialtyUserUseCase';
import { getByUserAndSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/getByUserAndSpecialtyUserUseCase';
import { getAllByUserSpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/getAllByUserSpecialtyUserUseCase';
import { getAllBySpecialtyUserUseCase } from '../../application/usecases/SpecialtyUser/getAllBySpecialtyUserUseCase';
import { sendReportUserSpecialtyUseCase } from '../../application/usecases/SpecialtyUser/sendReportUserSpecialtyUseCase';
import { IndividualEvaluationRepository } from '../../infrastructure/database/repositories/IndividualEvaluationRepository';
import { UnitEvaluationRepository } from '../../infrastructure/database/repositories/UnitEvaluationRepository';
import { IndividualRankingRepository } from '../../infrastructure/database/repositories/InidividualRankingRepository';
import { UnitRankingRepository } from '../../infrastructure/database/repositories/UnitRankingRepository';

export const SpecialtyUserController = {

  async create(req: Request, res: Response): Promise<void>  {
    const { userId, specialtyId } = req.body;
    try {
      const result = await createSpecialtyUserUseCase( {userId, specialtyId}, UserSpecialtyRepository);
      res.status(201).json({
        success: true,
        message: 'Especialidade atribuída com sucesso',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const { userId, specialtyId } = req.body;
    try {
      const result = await updateSpecialtyUserUseCase( 
        id, 
        {userId, specialtyId}, 
        UserSpecialtyRepository
      );
      res.status(201).json({
        success: true,
        message: 'Especialidade atribuída com sucesso',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteSpecialtyUserUseCase(id, UserSpecialtyRepository);
      res.status(204).json({ success: true, message: 'deleted'});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req: Request, res: Response): Promise<void>  {
    try {
      const result = await getAllSpecialtyUserUseCase(UserSpecialtyRepository);
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
      const result = await getByIdSpecialtyUserUseCase(id, UserSpecialtyRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByUserAndSpecialty(req: Request, res: Response): Promise<void>  {
    const { userId, specialtyId } = req.params
    try {
      const result = await getByUserAndSpecialtyUserUseCase(userId, specialtyId, UserSpecialtyRepository);
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
      const result = await getAllByUserSpecialtyUserUseCase(userId, UserSpecialtyRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllBySpecialty(req: Request, res: Response): Promise<void>  {
    const { specialtyId } = req.params
    try {
      const result = await getAllBySpecialtyUserUseCase(specialtyId, UserSpecialtyRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async sendReport(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const { userId, specialtyId, report } = req.body
    try {
      const result = await sendReportUserSpecialtyUseCase(id, userId, specialtyId, report, UserSpecialtyRepository);
      res.status(200).json({
        success: true,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async approve(req: Request, res: Response): Promise<void>  {
    const { userId, specialtyId } = req.params;
    const { userIdApproved, comment } = req.body;
    try {
      const result = await approvedSpecialtyUserUseCase(
        userId, 
        specialtyId, 
        userIdApproved,
        comment,
        UserSpecialtyRepository,
        UserRepository,
        IndividualEvaluationRepository,
        IndividualRankingRepository,

        UnitEvaluationRepository,
        UnitRankingRepository,

        unitRepository
      );
      res.status(201).json({
        success: true,
        message: 'Aprovação registrada com sucesso',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async reject(req: Request, res: Response): Promise<void>  {
    const { userId, specialtyId } = req.params;
    const { userIdRejected, comment } = req.body;
    try {
      const result = await rejectedSpecialtyUserUseCase(
        userId, 
        specialtyId,
        userIdRejected, 
        comment,
        UserSpecialtyRepository,
        UserRepository
      );
      res.status(201).json({
        success: true,
        message: 'Rejeição registrada com sucesso',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
}