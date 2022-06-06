import { AutomaticEvaluation } from "./automaticEvaluation";
import { ManualEvaluation } from "./manualEvaluation";
import { UserEvaluation } from "./userEvaluation";

interface IAccessibilityStatement {
Id: number;
CreatedAt: Date;
UpdatedAt: Date;
url: string;
conformance: string;
evidence: string;
seal: string;
statementDate: Date;
state: any;
manualEvaluationList: ManualEvaluation[];
automaticEvaluationList: AutomaticEvaluation[];
userEvaluationList: UserEvaluation[];
}

export class AccessibilityStatement implements IAccessibilityStatement {
  Id: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  url: string;
  conformance: string;
  evidence: string;
  seal: string;
  statementDate: Date;
  state: any;
  manualEvaluationList: ManualEvaluation[];
  automaticEvaluationList: AutomaticEvaluation[];
  userEvaluationList: UserEvaluation[];
}
