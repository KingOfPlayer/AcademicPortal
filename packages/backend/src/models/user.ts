export const UserRoles = ['admin', 'administrator', 'jury', 'applicant']

export interface IUser{
    roles?: [string];

    id_number?: number;
    name?: string;
    surname?: string;
    bornYear?: number;

    age?: number;
    email?: string;
    password?: string;
}

export const UserSchemaOptions = {
    roles:{ type: [String], enum: UserRoles, required: true },

    id_number: { type: Number, required: true , index:{unique:true}},
    name: { type: String, required: true },
    surname: { type: String, required: true },
    bornYear: { type: Number, required: true },

    age: { type: Number },
    email: { type: String },
    password: { type: String }
};