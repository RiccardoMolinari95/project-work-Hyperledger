/* eslint-disable no-mixed-spaces-and-tabs */
import {AnimalOwnerBlockchain} from "./animalOwnerBlockchain";
import {Animal} from "../entity";

export class AnimalBlockchain {
    private ID: string;
    private name: string
    private type: string;
    private breed: string;
    private birthDate: string;
    private imgUrl: string;
    private description: string;
    private pedigree: string;
    private owner: AnimalOwnerBlockchain;


    constructor(animal: Animal) {
    	this.ID = animal._id;
    	this.name = animal.name;
    	this.type = animal.type;
    	this.breed = animal.breed;
    	this.birthDate = animal.birthDate.toString();
    	this.imgUrl = animal.imgUrl;
    	this.description = animal.description;
    	this.pedigree = String(animal.pedigree);
    	this.owner = {
    		ID: animal.ownerId,
    		name: animal.ownerName,
    		surname: animal.ownerLastname,
    	} as AnimalOwnerBlockchain;
    }
}
