import { Schema, SchemaDefinition, Types, model } from "mongoose";

export interface IToken {
  _id?: Types.ObjectId;
  token?: string;
}

const TokenSchemaOptions: SchemaDefinition = {
  token: { type: String, required: true, index: { unique: true } },
};

const TokenSchema = new Schema<IToken>(TokenSchemaOptions);

export const Token = model<IToken>("tokens", TokenSchema);
