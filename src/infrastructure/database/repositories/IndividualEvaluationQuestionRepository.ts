import { IIndividualEvaluationQuestion, IndividualEvaluationQuestion } from '../models/IndividualEvaluationQuestion';

export interface IIndividualEvaluationQuestionRepository {
  create(question: string, points: number): Promise<IndividualEvaluationQuestion>;
  findAll(): Promise<IndividualEvaluationQuestion[]>;
  findById(id: string): Promise<IndividualEvaluationQuestion>;
  update(id: string, data: Partial<IndividualEvaluationQuestion>): Promise<IndividualEvaluationQuestion>;
  delete(id: string): Promise<IndividualEvaluationQuestion>;
}

export const IndividualEvaluationQuestionRepository = {
  create: async (question: string, points: number): Promise<IndividualEvaluationQuestion> => {
    return await IndividualEvaluationQuestion.create({ question, points });
  },
  findAll: async (): Promise<IndividualEvaluationQuestion[]> => {
    return await IndividualEvaluationQuestion.findAll();
  },
  findById: async (id: string): Promise<any> => {
    return await IndividualEvaluationQuestion.findByPk(id);
  },
  update: async (id: string, data: Partial<IIndividualEvaluationQuestion>): Promise<IndividualEvaluationQuestion> => {
    const question = await IndividualEvaluationQuestion.findByPk(id);
    if (!question) throw new Error('Pergunta não encontrada.');
    return await question.update(data);
  },
  delete: async (id: string): Promise<any> => {
    const question = await IndividualEvaluationQuestion.findByPk(id);
    if (!question) throw new Error('Pergunta não encontrada.');
    await question.destroy();
  },
}
