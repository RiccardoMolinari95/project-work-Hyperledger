//import typeorm = require('typeorm');

const animals = [
	{
		_id: '5f2678dff22e1f4a3c0782ee',
		name:      'Cookie',
		type:      'DOG',
		breed:     'Pinscher',
		birthDate: '2017-01-23'
	}
];

const dbMock = {
	Animal: {
		find: jest.fn().mockReturnValue(animals),
		findOne: jest.fn().mockReturnValue(animals[0]),
		save: jest.fn().mockReturnValue(animals[0]),
		remove: jest.fn(),
	},
};

jest.mock('typeorm', () => {
	createConnection: jest.fn().mockReturnValue({
		getRepository: (model) => dbMock[model.name],
	});
	
	getConnectionOptions: jest.fn().mockReturnValue({});
});

describe('Server', async () => {
	let server;

	beforeEach(async () => {
		console.log('AHAHAHA');
		server = await import('../src/index');
//		server = await require('../src/index');
		console.log('server is ready', server);
		await server.ready();
	});

	afterAll(() => server.close());

	test('/health returns ok', (done) => {
		server.inject(
			{
				method: 'GET',
				url: '/health',
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(JSON.parse(res.payload)).toEqual({ status: 'ok' });
				done(err);
			}
		);
	});

	test('GET /animal/:_id returns one of animal by _id', (done) => {
		server.inject(
			{
				method: 'GET',
				url: `/animal/${animals[0]._id}`,
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(dbMock.Animal.findOne).toHaveBeenCalledWith(animals[0]._id);
				expect(JSON.parse(res.payload)).toEqual(animals[0]);
				done(err);
			}
		);
	});

	test('GET /animal returns list of animals', (done) => {
		server.inject(
			{
				method: 'GET',
				url: '/animal',
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(dbMock.Animal.find).toHaveBeenCalledWith();
				expect(JSON.parse(res.payload)[0]).toEqual(animals[0]);
				done(err);
			}
		);
	});

	test('Add Animal POST /animal', async (done) => {
		const res = await server.inject({
			method: 'POST',
			url: '/animal',
			payload: {
				_id: '5f2678dff22e1f4a3c9992ee',
				name:      'Nani',
				type:      'CAT',
				breed:     'Persian',
				birthDate: '2021-04-25'
			}
		});
		expect(res.statusCode).toBe(201);
		done();
	});

	test('Update Animal POST /animal/:id', async (done) => {
		const res = await server.inject({
			method: 'PUT',
			url: '/animal/5f2678dff22e1f4a3c0782ee',
			payload: {
				breed: 'Aegyptian'
			}
		});
		expect(res.statusCode).toBe(200);
		done();
	});

	test('DELETE /animal/:id deletes a animal', (done) => {
		const { _id } = animals[0];
		server.inject(
			{
				method: 'DELETE',
				url: `/animal/${_id}`,
			},
			(err, res) => {
				expect(res.statusCode).toBe(200);
				expect(dbMock.Animal.findOne).toHaveBeenCalledWith(_id);
				expect(dbMock.Animal.remove).toHaveBeenCalledWith(animals[0]);
				done(err);
			}
		);
	});
});
