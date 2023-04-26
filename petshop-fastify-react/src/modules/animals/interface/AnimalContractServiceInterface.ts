import {Animal} from '../entity';

export interface AnimalContractServiceInterface {
	creteAnimal(animal: Animal): Promise<string>;
	updateAnimalName(id: string, name: string): Promise<string>;
	updateAnimal(id: string, animal: Animal): Promise<string>;
	getAllAnimal(): Promise<string>;
	getAnimalHistory(animal_id: string): Promise<string>;
}

