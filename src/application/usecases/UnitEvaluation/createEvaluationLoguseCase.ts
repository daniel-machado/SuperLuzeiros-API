import { IEvaluationLogRepository } from "../../../infrastructure/database/repositories/EvaluationLogRepository";

export const createEvaluationLogUseCase = async (
  unitId: string,
  evaluatedBy: string,
  action: "created" |"updated" | "deleted",
  evaluationLogRepository: IEvaluationLogRepository
) => {

  await evaluationLogRepository.createLog(unitId, evaluatedBy, action);
}