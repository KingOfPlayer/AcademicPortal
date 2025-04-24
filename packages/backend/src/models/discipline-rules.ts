import { model, Schema, SchemaDefinition } from "mongoose";
import {
  DisciplineActivityRulechema,
  IDisciplineActivityRule,
} from "./discipline-activity-rules";
import {
  DisciplineStaffPointRuleSchema,
  IDisciplineStaffPointRule,
} from "./discipline-point-rules";

export interface IDisciplineRule {
  disiciplineName: string;
  activityRules: IDisciplineActivityRule[];
  pointRules: IDisciplineStaffPointRule[];
}

export const DisciplineRuleOptions: SchemaDefinition<IDisciplineRule> =
  {
    disiciplineName: { type: String, required: true, unique: true },
    activityRules: {
      type: [DisciplineActivityRulechema],
      required: true,
    },
    pointRules: {
      type: [DisciplineStaffPointRuleSchema],
      required: true,
    },
  };

const DisciplineRuleSchema =
  new Schema<IDisciplineRule>(
    DisciplineRuleOptions,
    { autoCreate: false },
  );

export const DisciplineRule =
  model<IDisciplineRule>(
    "academic_staff_discipline",
    DisciplineRuleSchema,
  );
