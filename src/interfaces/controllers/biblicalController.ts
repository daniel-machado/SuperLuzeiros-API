import { Request, Response } from 'express';

export const biblicalController = {

  async create(req: Request, res: Response): Promise<void> {
    const {
      name,
      type,
      minAge,
      maxAge = 100,
      emblem,
      requirements
    } = req.body;

    if (!name || !type || !minAge) {
      res.status(400).json({ error: "Os campos 'name', 'type' e 'minAge' são obrigatórios" });
      return
    }
  
    try {
      // Filtra apenas os campos definidos (não null ou undefined)
      const classData = {
        name,
        type,
        minAge,  // Converte minAge para número
        ...(maxAge && { maxAge: Number(maxAge) }),
        ...(emblem && { emblem }),
        ...(requirements && { requirements })
      };
  
      const result = await createClassUseCase(classData, ClassRepository);
  
      res.status(201).json({
        success: true,
        message: 'Class Criada',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async getAllClass(req: Request, res: Response): Promise<void>  {

    try {
      const result = await getAllClassUseCase(ClassRepository);
      res.status(201).json({
        success: true,
        message: 'Todas as Classes',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByType(req: Request, res: Response): Promise<void>  {
    const { type } = req.body;
    try {
      const result = await getByTypeClassUseCase(type, ClassRepository);
      res.status(201).json({
        success: true,
        message: `Classes ${type}`,
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void>  {
    const { id } = req.params;
    try {
      const result = await getByIdClassUseCase(id, ClassRepository)
      res.status(201).json({
        success: true,
        message: 'Classe',
        result
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      name,
      type,
      minAge,
      maxAge,
      emblem,
      requirements
    } = req.body;
  
    try {
      // Filtra apenas os campos definidos (não null ou undefined)
      const classData = {
        ...(type && { type }),
        ...(name && { name }),
        ...(minAge && { minAge }),
        ...(maxAge && { maxAge }),
        ...(emblem && { emblem }),
        ...(requirements && { requirements })
      };
  
      // Verifica se há campos para atualizar
      if (Object.keys(classData).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo válido para atualizar.'
        });
      }
  
      const result = await updateClassUseCase(id, classData, ClassRepository);
  
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Classe não encontrada.'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Classe atualizada com sucesso.',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await deleteClassUseCase(id, ClassRepository);
      // Retorna 204 (No Content) para sucesso sem corpo
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
}