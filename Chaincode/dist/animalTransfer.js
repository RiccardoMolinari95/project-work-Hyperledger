"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalTransferContract = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
const fabric_contract_api_1 = require("fabric-contract-api");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
let AnimalTransferContract = class AnimalTransferContract extends fabric_contract_api_1.Contract {
    async InitLedger(ctx) {
        const animals = [];
    }
    // CreateAnimal issues a new Animal to the world state with given details.
    async CreateAnimal(ctx, id, name, breed, birthDate, imgUrl, description, type, pedigree) {
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
        await ctx.stub.putState(id, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(animal))));
    }
    // ReadAnimal returns the Animal stored in the world state with given id.
    async ReadAnimal(ctx, id) {
        const animalJSON = await ctx.stub.getState(id); // get the Animal from chaincode state
        if (!animalJSON || animalJSON.length === 0) {
            throw new Error(`The animal with id:  ${id} already exists`);
        }
        return animalJSON.toString();
    }
    // UpdateAnimal updates an existing Animal in the world state with provided parameters.
    async UpdateAnimalName(ctx, id, name) {
        const exists = await this.AnimalExists(ctx, id);
        if (!exists) {
            throw new Error(`The Animal with id:  ${id} does not exist`);
        }
        const animalString = await this.ReadAnimal(ctx, id);
        const savedAnimal = JSON.parse(animalString);
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
        return ctx.stub.putState(id, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(updatedAnimalName))));
    }
    // UpdateAnimal updates an existing Animal in the world state with provided parameters.
    async UpdateAnimal(ctx, id, name, breed, birthDate, imgUrl, description, type, pedigree) {
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
        return ctx.stub.putState(id, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(updatedAnimal))));
    }
    // DeleteAnimal deletes an given Animal from the world state.
    async DeleteAnimal(ctx, id) {
        const exists = await this.AnimalExists(ctx, id);
        if (!exists) {
            throw new Error(`The Animal with id: ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }
    // TODO: Da testare e implementare lato AnimalContractService e lato back-end (pet-shop)
    // GetAllAnimal returns all animal found in the world state.
    async GetAllAnimal(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all animal in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            }
            catch (err) {
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
            let jsonRes = {};
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                }
                else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err) {
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
    async GetAnimalHistory(ctx, animal_id) {
        let resultsIterator = await ctx.stub.getHistoryForKey(animal_id);
        let results = await this._GetAllResults(resultsIterator, true);
        return JSON.stringify(results);
    }
    // AnimalExists returns true when Animal with given ID exists in world state.
    async AnimalExists(ctx, id) {
        const animalJSON = await ctx.stub.getState(id);
        return animalJSON && animalJSON.length > 0;
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "InitLedger", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "CreateAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "ReadAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "UpdateAnimalName", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "UpdateAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "DeleteAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "GetAllAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "GetAnimalHistory", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalTransferContract.prototype, "AnimalExists", null);
AnimalTransferContract = __decorate([
    fabric_contract_api_1.Info({ title: 'AnimalTransfer', description: 'Smart contract for manipulate animals' })
], AnimalTransferContract);
exports.AnimalTransferContract = AnimalTransferContract;
//# sourceMappingURL=animalTransfer.js.map