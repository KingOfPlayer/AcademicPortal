import { IUser } from "../models/user";
import * as soap from 'soap';

export async function ValidateUserOnEgov(user:IUser):Promise<boolean>{
    try{
        const client = await soap.createClientAsync("https://tckimlik.nvi.gov.tr/service/kpspublic.asmx?WSDL");
        const payload = {TCKimlikNo:user.id_number,Ad:user.name,Soyad:user.surname,DogumYili:user.bornYear}
        const response = await client.TCKimlikNoDogrulaAsync(payload);
        return response[0].TCKimlikNoDogrulaResult;
    }catch(err:unknown){
        throw new Error("Soap client has problem");
    }
}