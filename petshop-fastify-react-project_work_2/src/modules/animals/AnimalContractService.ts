import {AnimalContractServiceInterface} from './interface/AnimalContractServiceInterface';
import {Animal} from './entity';
import {BlockchainServiceInterface} from '../fabric/interface/BlockchainServiceInterface';
import {getBlockchainService} from '../common/ServiceFactory';
import config from '../../config/Config';
import {TextDecoder} from 'util';
import {AnimalBlockchain} from './dto/animalBlockchain';
import { AnimalOwnerBlockchain } from './dto/animalOwnerBlockchain';

export class AnimalContractService implements AnimalContractServiceInterface {
		
    private blockchainService: BlockchainServiceInterface = getBlockchainService();
	private utf8Decoder = new TextDecoder();

	async createAnimal(animal: Animal): Promise<string> {
		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);

		//So che non è correttissimo....
		animal.ownerId = animal.ownerName+ '.' + animal.ownerLastname;

		try {
			const commit = await contract.submitAsync('CreateAnimal',
				{arguments: [JSON.stringify(new AnimalBlockchain(animal))]});

			return commit.getTransactionId();
		} catch (error) {
			console.log('Error during the transaction with message: ', error);
			throw error;
		}
	}

	async searchAnimalByName(animalName: string): Promise<AnimalBlockchain> {
		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);
		try {
			const resultBytes = await contract.evaluateTransaction('SearchAnimal',
				`{"selector":{"name": "${animalName}"} }`);
			const resultJson = this.utf8Decoder.decode(resultBytes);
			console.log(JSON.parse(resultJson) as AnimalBlockchain);
			return JSON.parse(resultJson) as AnimalBlockchain;

		} catch (error) {
			console.log('Error during the animal name update with message: ', error);
			throw error;
		}
	}

	async searchAnimalByOwnerId(ownerId: string): Promise<AnimalBlockchain> {
		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);
		try {
			const resultBytes = await contract.evaluateTransaction('SearchAnimalsByOwnerId',
				`{
					"selector": {
					   "owner.ID": {
						  "$eq": "${ownerId}"
					   }
					}
				 }`);
			const resultJson = this.utf8Decoder.decode(resultBytes);
			console.log(JSON.parse(resultJson) as AnimalBlockchain);
			return JSON.parse(resultJson) as AnimalBlockchain;

		} catch (error) {
			console.log('Error during the animal name update with message: ', error);
			throw error;
		}
	}

	async updateAnimalName(id: string, name: string): Promise<string> {
		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);
		try {
			const commit = await contract.submitAsync('UpdateAnimalName',
				{arguments: [id, name]});
			const resultJson = this.utf8Decoder.decode(commit.getResult());

			return commit.getTransactionId();
		} catch (error) {
			console.log('Error during the animal name update with message: ', error);
			throw error;
		}
	}

	async updateAnimal(id: string, animal: Animal): Promise<string> {
		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);
		try {

			const commit = await contract.submitAsync('UpdateAnimal',
				{arguments: [
					id,
					animal.name,
					animal.breed, 
					animal.birthDate.toString(), 
					animal.imgUrl, 
					animal.description, 
					animal.type, 
					String(animal.pedigree)
				]});
			const resultJson = this.utf8Decoder.decode(commit.getResult());

			return commit.getTransactionId();
		} catch (error) {
			console.log('Error during the animal name update with message: ', error);
			throw error;
		}
	}

	async updateOwner(id: string, owner: AnimalOwnerBlockchain): Promise<string> {

		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);
		try {
			const commit = await contract.submitAsync('UpdateOwner',
				{arguments: [
					id,
					owner.ID,
					owner.name,
					owner.surname
				]});
			const resultJson = this.utf8Decoder.decode(commit.getResult());

			return commit.getTransactionId();
		} catch (error) {
			console.log('Error during the animal name update with message: ', error);
			throw error;
		}
	}

	// TODO: Implement
	async getAllAnimal(): Promise<string> {

		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);
		try {

			const resultBytes = await contract.evaluateTransaction('GetAllAnimal');
			const resultJson = this.utf8Decoder.decode(resultBytes);

			return resultJson;

		} catch (error) {
			console.log('Error during getAllAnimal', error);
			throw error;
		}

	}

	async getAnimalHistory(animal_id: string): Promise<string> {
		const gateway = await this.blockchainService.connect();
		const network = gateway.getNetwork(config.fabric.channel.name);
		const contract = network.getContract(config.fabric.chaincode.name);
		try {

			console.log('\n--> Evaluate Transaction: GetAnimalHistory, get the history of an asset');
			const result = await contract.evaluateTransaction('GetAnimalHistory', animal_id);

			const resultJson = this.utf8Decoder.decode(result);

			return resultJson;

		} catch (error) {
			console.log('Error during animal history function: ', error);
			throw error;
		}

	}

	private prettyJSONString(inputString) {
		return JSON.stringify(JSON.parse(inputString), null, 2);
	}


}
