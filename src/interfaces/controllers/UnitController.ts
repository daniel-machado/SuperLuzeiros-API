import { Request, Response } from 'express';

import { unitRepository } from '../../infrastructure/database/repositories/UnitRepository';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';


// Use cases
import { createUnitUseCase } from '../../application/usecases/units/createUnitUseCase';
import { getAllUnitUseCase } from '../../application/usecases/units/getAllUnitUseCase';
import { getOneUnitUseCase } from '../../application/usecases/units/getOneUnitUseCase';
import { updateUnitUseCase } from '../../application/usecases/units/updateUnitUseCase';
import { deleteUnitUseCae } from '../../application/usecases/units/deleteUnitUseCase';
import { addCounselorToUnitUseCase } from '../../application/usecases/units/addCounselorToUnitUseCase';
import { addDbvToUnitUseCase } from '../../application/usecases/units/addDbvToUnitUseCase';
import { removeCounselorFromUnitUseCase } from '../../application/usecases/units/removeCounselorFromUnitUseCase';
import { removeDbvFromUnitUseCase } from '../../application/usecases/units/removeDbvFromUnitUseCase';
import { existCounselorUnitUseCase } from '../../application/usecases/units/existCounselorUnitUseCase';
import { existDbvUnitUseCase } from '../../application/usecases/units/existDbvUnitUseCase';

export const unitController = {

  // Criar Unidade
  async createUnit(req: Request, res: Response): Promise<void>  {
    const { name, photo } = req.body;
    try {
      const result = await createUnitUseCase(name, photo, unitRepository);
      res.status(201).json({
        success: true,
        message: 'Unit has been created successfully',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Listar Unidades
  async getAllUnits(req: Request, res: Response): Promise<void>  {
    try {
      const units = await getAllUnitUseCase(unitRepository);
      res.status(200).json({
        success: true,
        message: 'List Units',
        units
    });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Buscar Unidade por ID
  async getUnitById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      const unit = await getOneUnitUseCase(id, unitRepository);
      if (!unit) {
        res.status(404).json({ success: false, error: 'Unidade não encontrada' });
        return
      }
      res.json({
        success: true,
        unit
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Atualizar Unidade
  async updateUnit(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    const { name, photo } = req.body;

    console.log(name, photo)

    try {
      const updatedUnit = await updateUnitUseCase(
        id, name, photo, unitRepository);
      if (!updatedUnit) {
        res.status(404).json({ success: false, error: 'Unidade não encontrada' });
        return
      }
      res.json({success: true, updatedUnit});
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete Unidade
  async deleteUnit(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      await deleteUnitUseCae(id, unitRepository);
      res.status(204).send({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Adicionar Conselheiro
  async addCounselorToUnit(req: Request, res: Response): Promise<void>  {
    const { unitId } = req.params;
    const {userId} = req.body

    try {
      const result = await addCounselorToUnitUseCase(unitId, userId, unitRepository, UserRepository);
      res.json({success: true, result});
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Verificar se o conselheiro já está na unidade
  async existeUnitCounselor(req: Request, res: Response): Promise<void>  {
    const { userId } = req.params;
    try {
      const result = await existCounselorUnitUseCase(userId, unitRepository);
      res.json({success: true, result});
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

    // Verificar se o dbv já está na unidade
    async existeUnitDbv(req: Request, res: Response): Promise<void>  {
      const { userId } = req.params;
      try {
        const result = await existDbvUnitUseCase(userId, unitRepository);
        res.json({success: true, result});
      } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
      }
    },

  // Adicionar Desbravador
  async addDbvToUnit(req: Request, res: Response): Promise<void>  {
    const { unitId } = req.params;
    const { userId } = req.body
    try {
      const result = await addDbvToUnitUseCase(unitId, userId, unitRepository, UserRepository);
      res.json({success: true, result});
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Remover conselheiro
  async removeCounselorFromUnit(req: Request, res: Response): Promise<void>  {
    const { unitId, userId } = req.params
    try {
      await removeCounselorFromUnitUseCase(unitId, userId, unitRepository);
      res.status(204).send({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async removeDbvFromUnit(req: Request, res: Response): Promise<void>  {
    const { unitId, userId } = req.params
    try {
      await removeDbvFromUnitUseCase(unitId, userId, unitRepository, UserRepository);
      res.status(204).send({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
}