import { IUnitEvaluationQuestion, UnitEvaluationQuestion } from '../models/UnitEvaluationQuestion';

export interface IUnitEvaluationQuestionRepository {
  create(question: string, points: number, typeQuestion: "number" | "text" | "yes_no", description?: string,): Promise<UnitEvaluationQuestion>;
  findAll(): Promise<UnitEvaluationQuestion[]>;
  findById(id: string): Promise<UnitEvaluationQuestion>;
  update(id: string, data: Partial<IUnitEvaluationQuestion>): Promise<UnitEvaluationQuestion>;
  delete(id: string): Promise<UnitEvaluationQuestion>;
}

export const UnitEvaluationQuestionRepository = {
  create: async (question: string, points: number, typeQuestion: "number" | "text" | "yes_no", description?: string,): Promise<UnitEvaluationQuestion> => {
    return await UnitEvaluationQuestion.create({ question, points, typeQuestion, description });
  },
  findAll: async (): Promise<UnitEvaluationQuestion[]> => {
    return await UnitEvaluationQuestion.findAll();
  },
  findById: async (id: string): Promise<any> => {
    return await UnitEvaluationQuestion.findByPk(id);
  },
  update: async (id: string, data: Partial<IUnitEvaluationQuestion>): Promise<UnitEvaluationQuestion> => {
    const question = await UnitEvaluationQuestion.findByPk(id);
    if (!question) throw new Error('Pergunta não encontrada.');
    return await question.update(data);
  },
  delete: async (id: string): Promise<any> => {
    const question = await UnitEvaluationQuestion.findByPk(id);
    if (!question) throw new Error('Pergunta não encontrada.');
    await question.destroy();
  },
}
