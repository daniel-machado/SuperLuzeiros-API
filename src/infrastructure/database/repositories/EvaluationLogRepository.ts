import { EvaluationLog } from '../models/EvaluationLog';

export interface IEvaluationLogRepository {
  createLog(unitId: string, evaluatedBy: string, action: "created" |"updated" | "deleted"): Promise<void>;
}

export const EvaluationLogRepository  = {
  createLog: async (unitId: string, evaluatedBy: string, action: "created" |"updated" | "deleted"): Promise<void> => {
    await EvaluationLog.create({ unitId, evaluatedBy, action });
  }
}
