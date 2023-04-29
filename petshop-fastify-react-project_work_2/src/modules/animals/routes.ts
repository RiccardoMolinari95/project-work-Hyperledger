import {deleteAnimalSchema, listAnimalsSchema} from './schema';
import {getAnimalContractService} from '../common/ServiceFactory';
import {Animal} from './entity';

export default function animalHandler(server, options, next) {
	server.get(
		'/',
		{ schema: listAnimalsSchema },
		async (req, res) => {
			req.log.info('list animals from db');
			const animals = await server.db.animals.find();
			res.send(animals);
		}
	);

	server.get('/all', async (req, res) => {
		req.log.info('get all animals from ledger');
		const result = await getAnimalContractService().getAllAnimal();
		res.send(result);
	});

	server.get('/history/:_name', async (req, res) => {
		req.log.info('get history of a animal for a given name from ledger');
		const result = await getAnimalContractService().getAnimalHistory(req.params._name);
		res.send(result);
	});

	server.get('/:_id', async (req, res) => {
		req.log.info('get one animals from db');
		const animal = await server.db.animals.findOne(req.params._id);
		res.send(animal);
	});

	server.get('/name/:_name', async (req, res) => {
		req.log.info('Get animal by name');
		const name = req.params._name;
		res.status(200).send(await getAnimalContractService().searchAnimalByName(name));
	});

	server.get('/ownerId/:_ownerId', async (req, res) => {
		req.log.info('Get all animals by ownerId');
		const ownerId = req.params._ownerId;
		res.status(200).send(await getAnimalContractService().searchAnimalByOwnerId(ownerId));
	});

	server.post('/', async (req, res) => {
		req.log.info('Add animals to db');

		let animals = await server.db.animals.save(req.body) as Animal;
		animals.transactionHash = await getAnimalContractService().createAnimal(animals);
		animals = await server.db.animals.save(req.body) as Animal;
		res.status(201).send(animals);
	});

	server.put('/:_id', async (req, res) => {
		req.log.info('Update animal to db');
		const _id = req.params._id;

		const animal = await server.db.animals.findOne(req.params._id);
		const new_animal = {...req.body};

		//Setto l'owner vecchio siccome non viene aggiornato
		new_animal.ownerId = animal.ownerId;
		new_animal.ownerName = animal.ownerName;
		new_animal.ownerLastname = animal.ownerLastname;

		console.log({...new_animal});

		new_animal.transactionHash = await getAnimalContractService().updateAnimal(animal._id, new_animal);

		const animals = await server.db.animals.save({_id, ...new_animal});
		res.status(200).send(animals);
	});

	server.put('/:_id/name', async (req, res) => {
		req.log.info('Update animal name to db');
		const _id = req.params._id;
		const animal = await server.db.animals.findOne(req.params._id);
		animal.transactionHash = await getAnimalContractService().updateAnimalName(animal._id, req.body.name );
		animal.name = req.body.name;
		const animals = await server.db.animals.save({ _id, ...animal });
		res.status(200).send(animals);
	});

	server.put('/changeOwner/:_id', async (req, res) => {
		req.log.info('Update animal owner');
		const _id = req.params._id;
		const animal = await server.db.animals.findOne(req.params._id);

		const ownerId = req.body.ownerName + '.' + req.body.ownerLastname;
		
		const newOwner = {...req.body};
		const _owner= newOwner;
		_owner.ID = ownerId;
		_owner.name = req.body.ownerName;
		_owner.surname = req.body.ownerLastname;

		animal.transactionHash = await getAnimalContractService().updateOwner(animal._id, _owner );
		animal.ownerId = _owner.ID;
		animal.ownerName = _owner.name;
		animal.ownerLastname = _owner.surname;
		const animals = await server.db.animals.save({ _id, ...animal });
		res.status(200).send(animals);
	});

	server.delete(
		'/:_id',
		{ schema: deleteAnimalSchema },
		async (req, res) => {
			req.log.info(`delete animal ${req.params._id} from db`);
			const animal = await server.db.animals.findOne(req.params._id);
			await server.db.animals.remove(animal);
			res.code(200).send({});
		}
	);


	next();
}
