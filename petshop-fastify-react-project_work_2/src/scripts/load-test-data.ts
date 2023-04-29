import dbOptions from '../../ormconfig.json';
import testData from '../../test/testdata.json';
import { ConnectionOptions, createConnection } from 'typeorm';
import { Animal } from '../modules/animals/entity';

createConnection(dbOptions as ConnectionOptions)
	.then(conn => {
		const animalRepo = conn.getRepository(Animal);
		console.log('Loading test data...');
		testData.forEach((pet) => {
			console.log('Saving pet: ' + pet.name);
			animalRepo.save(pet as unknown as Animal);
		});
	});

