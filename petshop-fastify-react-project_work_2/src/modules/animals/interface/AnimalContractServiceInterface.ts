import {Animal} from '../entity';
import {AnimalBlockchain} from '../dto/animalBlockchain';
import {AnimalOwnerBlockchain} from '../dto/animalOwnerBlockchain';

export interface AnimalContractServiceInterface {
    createAnimal(animal: Animal): Promise<string>;
	updateAnimalName(id: string, name: string): Promise<string>;
	updateAnimal(id: string, animal: Animal): Promise<string>;
	updateOwner(id: string, owner: AnimalOwnerBlockchain): Promise<string>;
	getAllAnimal(): Promise<string>;
	getAnimalHistory(animal_id: string): Promise<string>;
	searchAnimalByName(animalName: string): Promise<AnimalBlockchain>;
	searchAnimalByOwnerId(ownerId: string): Promise<AnimalBlockchain>;
}

