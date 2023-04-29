import {BlockchainService} from '../fabric/BlockchainService';
import {AnimalContractService} from '../animals/AnimalContractService';
import {BlockchainServiceInterface} from '../fabric/interface/BlockchainServiceInterface';
import {AnimalContractServiceInterface} from '../animals/interface/AnimalContractServiceInterface';

let blockchainService: BlockchainServiceInterface = null;
let animalContractService: AnimalContractServiceInterface = null;

export function getBlockchainService() {
	if (!blockchainService) {
		blockchainService = new BlockchainService();
	}
	return blockchainService;
}

export function getAnimalContractService() {
	if (!animalContractService) {
		animalContractService = new AnimalContractService();
	}
	return animalContractService;
}
