/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Animal} from './animal';

@Info({title: 'AnimalTransfer', description: 'Smart contract for manipulate animals'})
export class AnimalTransferContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const animals: Animal[] = [];
    }

    // CreateAnimal issues a new Animal to the world state with given details.
    @Transaction()
    public async CreateAnimal(ctx: Context, id: string, name: string, breed: string, birthDate: string, imgUrl: string, description: string, type: string, pedigree: string): Promise<void> {
        const exists = await this.AnimalExists(ctx, id);
        if (exists) {
            throw new Error(`The animal with id:  ${id} already exists`);
        }

        const animal = {
            ID: id,
            name: name,
            breed: breed,
            birthDate: birthDate,
            imgUrl: imgUrl,
            description: description,
            type: type,
            pedigree: pedigree
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(animal))));
    }

    // ReadAnimal returns the Animal stored in the world state with given id.
    @Transaction(false)
    public async ReadAnimal(ctx: Context, id: string): Promise<string> {
        const animalJSON = await ctx.stub.getState(id); // get the Animal from chaincode state
        if (!animalJSON || animalJSON.length === 0) {
            throw new Error(`The animal with id:  ${id} already exists`);
        }
        return animalJSON.toString();
    }

    // UpdateAnimal updates an existing Animal in the world state with provided parameters.
    @Transaction()
    public async UpdateAnimalName(ctx: Context, id: string, name: string): Promise<void> {
        const exists = await this.AnimalExists(ctx, id);
        if (!exists) {
            throw new Error(`The Animal with id:  ${id} does not exist`);
        }

        const animalString = await this.ReadAnimal(ctx, id);
        const savedAnimal = JSON.parse(animalString) as Animal;
        
        // overwriting original Animal with new Animal
        const updatedAnimalName = {
            ID: id,
            name: name,
            breed: savedAnimal.breed,
            birthDate: savedAnimal.birthDate,
            imgUrl: savedAnimal.imgUrl,
            description: savedAnimal.description,
            type: savedAnimal.type,
            pedigree: savedAnimal.pedigree
        };

        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAnimalName))));
    }

    // UpdateAnimal updates an existing Animal in the world state with provided parameters.
    @Transaction()
    public async UpdateAnimal(ctx: Context, id: string, name: string, breed: string, birthDate: string, imgUrl: string, description: string, type: string, pedigree: string): Promise<void> {
        const exists = await this.AnimalExists(ctx, id);
        if (!exists) {
            throw new Error(`The Animal with id:  ${id} does not exist`);
        }

        // overwriting original Animal with new Animal
        const updatedAnimal = {
            ID: id,
            name: name,
            breed: breed,
            birthDate: birthDate,
            imgUrl: imgUrl,
            description: description,
            type: type,
            pedigree: pedigree
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAnimal))));
    }

    // DeleteAnimal deletes an given Animal from the world state.
    @Transaction()
    public async DeleteAnimal(ctx: Context, id: string): Promise<void> {
        const exists = await this.AnimalExists(ctx, id);
        if (!exists) {
            throw new Error(`The Animal with id: ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

	// TODO: Da testare e implementare lato AnimalContractService e lato back-end (pet-shop)
    // GetAllAnimal returns all animal found in the world state.
    @Transaction(false)
    @Returns('string')
    public async GetAllAnimal(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all animal in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

	
	// This is JavaScript so without Funcation Decorators, all functions are assumed
	// to be transaction functions
	//
	// For internal functions... prefix them with _
	async _GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
            let jsonRes: any = {};
			if (res.value && res.value.value.toString()) {
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.txId;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

	@Transaction(false)
    @Returns('string')
	// GetAnimalHistory returns the chain of custody for an Animal since issuance.
	public async GetAnimalHistory(ctx: Context, animal_id: string) {

		let resultsIterator = await ctx.stub.getHistoryForKey(animal_id);
		let results = await this._GetAllResults(resultsIterator, true);

		return JSON.stringify(results);
	}

    // AnimalExists returns true when Animal with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async AnimalExists(ctx: Context, id: string): Promise<boolean> {
        const animalJSON = await ctx.stub.getState(id);
        return animalJSON && animalJSON.length > 0;
    }

}
