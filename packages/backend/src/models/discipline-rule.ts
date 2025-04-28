import { model, Schema, SchemaDefinition, Types } from "mongoose";
import {
  DisciplineActivityRuleSchema,
  IDisciplineActivityRule,
} from "./discipline-activity-rule";
import {
  DisciplinePointRuleSchema,
  IDisciplinePointRule,
} from "./discipline-point-rule";

export interface IDisciplineRule {
  _id?: Types.ObjectId;
  disiciplineName: string;
  activityRules: IDisciplineActivityRule[];
  pointRules: IDisciplinePointRule[];
}

export const DisciplineRuleOptions: SchemaDefinition<IDisciplineRule> = {
  disiciplineName: { type: String, required: true, unique: true },
  activityRules: {
    type: [DisciplineActivityRuleSchema],
    required: true,
  },
  pointRules: {
    type: [DisciplinePointRuleSchema],
    required: true,
  },
};

export const DisciplineRuleSchema = new Schema<IDisciplineRule>(
  DisciplineRuleOptions,
  { autoCreate: false },
);

export const DisciplineRule = model<IDisciplineRule>(
  "academic_staff_discipline",
  DisciplineRuleSchema,
);
