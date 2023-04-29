import { Context, Contract } from 'fabric-contract-api';
export declare class AnimalTransferContract extends Contract {
    InitLedger(ctx: Context): Promise<void>;
    CreateAnimal(ctx: Context, animal: string): Promise<void>;
    ReadAnimal(ctx: Context, id: string): Promise<string>;
    UpdateAnimalName(ctx: Context, id: string, name: string): Promise<void>;
    UpdateAnimal(ctx: Context, id: string, name: string, breed: string, birthDate: string, imgUrl: string, description: string, type: string, pedigree: string): Promise<void>;
    UpdateOwner(ctx: Context, id: string, ownerId: string, ownerName: string, ownerLastname: string): Promise<void>;
    SearchAnimal(ctx: Context, query: string): Promise<string>;
    SearchAnimalsByOwnerId(ctx: Context, query: string): Promise<string>;
    DeleteAnimal(ctx: Context, id: string): Promise<void>;
    GetAllAnimal(ctx: Context): Promise<string>;
    _GetAllResults(iterator: any, isHistory: any): Promise<any[]>;
    GetAnimalHistory(ctx: Context, animal_id: string): Promise<string>;
    AnimalExists(ctx: Context, id: string): Promise<boolean>;
}
