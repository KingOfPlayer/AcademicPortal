
export interface IToken{
    token?: string;
}

export const TokenSchemaOptions = {
    token: { type: String, required: true , index:{unique:true}},
};
