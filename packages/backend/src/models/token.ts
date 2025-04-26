import { Schema, SchemaDefinition, model } from "mongoose";

export interface IToken {
  token?: string;
}

const TokenSchemaOptions: SchemaDefinition = {
  token: { type: String, required: true, index: { unique: true } },
};

const TokenSchema = new Schema<IToken>(TokenSchemaOptions);

export const Token = model<IToken>("tokens", TokenSchema);
