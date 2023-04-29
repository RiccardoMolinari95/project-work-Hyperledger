import 'reflect-metadata';
import fp from 'fastify-plugin';
import { createConnection, getConnectionOptions } from 'typeorm';
import { Animal } from '../modules/animals/entity';

export default fp(async server => {
	try {
		const connectionOptions = await getConnectionOptions();
		Object.assign(connectionOptions, {
			options: { encrypt: true },
			entities: [Animal]
		});

		const connection = await createConnection(connectionOptions);
		console.log('database connected');

		server.decorate('db', {
			animals: connection.getRepository(Animal)
		});
	} catch (error) {
		console.log(error);
		console.log('make sure you have set .env variables - see .env.sample');
	}
});
