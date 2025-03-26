
import { Schema, Model, model } from 'mongoose';

export interface IToken{
    token?: string;
}

const TokenSchemaOptions = {
    token: { type: String, required: true , index:{unique:true}},
};

interface ITokenMethods {

}

interface TokenModel extends Model<IToken, {}, ITokenMethods> {

}

const TokenSchema = new Schema<IToken, TokenModel, ITokenMethods>(TokenSchemaOptions);

export const Token = model<IToken, TokenModel>('tokens', TokenSchema);