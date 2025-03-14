import { Request, Response } from 'express';

import { SpecialtyRepository } from '../../infrastructure/database/repositories/SpecialtyRepository';

// Use Case
import { createSpecialtyUseCase } from '../../application/usecases/Specialty/createSpecialtyUseCase';
import { getAllSpecialtyUseCase } from '../../application/usecases/Specialty/getAllSpecialtyUseCase';
import { getByCategorySpecialtyUseCase } from '../../application/usecases/Specialty/getByCategorySpecialtyUseCase';
import { getByIdSpecialtyUseCase } from '../../application/usecases/Specialty/getByIdSpecialtyUseCase';
import { getByLevelSpecialtyUseCase } from '../../application/usecases/Specialty/getByLevelSpecialtyUseCase';
import { updateSpecialtyUseCase } from '../../application/usecases/Specialty/updateSpecialtyUseCase';
import { deleteSpecialtyUseCase } from '../../application/usecases/Specialty/deleteSpecialtyUseCase';

export const specialtyController = {

  async create(req: Request, res: Response): Promise<void> {
    const {
      category,
      name,
      codeSpe,
      numberSpe,
      levelSpe,
      yearSpe,
      emblem,
      requirements
    } = req.body;
  
    try {
      // Filtra apenas os campos definidos (não null ou undefined)
      const specialtyData = {
        category,
        name,
        ...(codeSpe && { codeSpe }),
        ...(numberSpe && { numberSpe }),
        ...(levelSpe && { levelSpe }),
        ...(yearSpe && { yearSpe }),
        ...(emblem && { emblem }),
        ...(requirements && { requirements })
      };
  
      const result = await createSpecialtyUseCase(specialtyData, SpecialtyRepository);
  
      res.status(201).json({
        success: true,
        message: 'Especialidade Criada',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getAllSpecialty(req: Request, res: Response): Promise<void>  {

    try {
      const result = await getAllSpecialtyUseCase(SpecialtyRepository);
      res.status(201).json({
        success: true,
        message: 'Todas as especialidades',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByCategory(req: Request, res: Response): Promise<void>  {
    const { category } = req.body;
    try {
      const result = await getByCategorySpecialtyUseCase(category, SpecialtyRepository);
      res.status(201).json({
        success: true,
        message: `Especialidades da área ${category}`,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      const result = await getByIdSpecialtyUseCase(id, SpecialtyRepository)
      res.status(201).json({
        success: true,
        message: 'Especialidade',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByLevel(req: Request, res: Response): Promise<void>  {
    const { level } = req.params;
    try {
      const result = await getByLevelSpecialtyUseCase(Number(level), SpecialtyRepository)
      res.status(201).json({
        success: true,
        message: `Especialidades do Nível ${level}`,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      category,
      name,
      codeSpe,
      numberSpe,
      levelSpe,
      yearSpe,
      emblem,
      requirements
    } = req.body;
  
    try {
      // Filtra apenas os campos definidos (não null ou undefined)
      const specialtyData = {
        ...(category && { category }),
        ...(name && { name }),
        ...(codeSpe && { codeSpe }),
        ...(numberSpe && { numberSpe }),
        ...(levelSpe && { levelSpe }),
        ...(yearSpe && { yearSpe }),
        ...(emblem && { emblem }),
        ...(requirements && { requirements })
      };
  
      // Verifica se há campos para atualizar
      if (Object.keys(specialtyData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo válido para atualizar.'
        });
      }
  
      const result = await updateSpecialtyUseCase(id, specialtyData, SpecialtyRepository);
  
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Especialidade não encontrada.'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Especialidade atualizada com sucesso.',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await deleteSpecialtyUseCase(id, SpecialtyRepository);
      // Retorna 204 (No Content) para sucesso sem corpo
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
}