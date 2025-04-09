import { Schema } from "mongoose";

export interface IActivity {
  ID: number;
  description: string;
  point: number;
}

const ActivitySchemaOptions = {
  ID: { type: Number, required: true, index: { unique: true } },
  description: { type: String, required: true },
  point: { type: Number, required: true },
};

export const ActivitySchema = new Schema<IActivity>(ActivitySchemaOptions);

export class Activity implements IActivity {
  ID!: number;
  description!: string;
  point!: number;

  constructor(ID: number, description: string, point: number) {
    this.ID = ID;
    this.description = description;
    this.point = point;
  }
}
