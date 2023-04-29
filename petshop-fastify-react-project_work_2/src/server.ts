import fastify from 'fastify';

import db from './plugins/db';
import healthHandler from './modules/health/routes';
import animalsHandler from './modules/animals/routes';

function createServer() {
	const server = fastify();
	server.register(require('fastify-cors'));

	server.register(require('fastify-oas'), {
		routePrefix: '/docs',
		exposeRoute: true,
		swagger: {
			info: {
				title: 'animal api',
				description: 'api documentation',
				version: '0.1.0'
			},
			servers: [
				{ url: 'http://localhost:3001', description: 'development' },
				{
					url: 'https://<production-url>',
					description: 'production'
				}
			],
			schemes: ['http'],
			consumes: ['application/json'],
			produces: ['application/json'],
		}
	});

	server.register(db);
	server.register(healthHandler, { prefix: '/health' });
	server.register(animalsHandler, { prefix: '/animal' });

	server.setErrorHandler((error, req, res) => {
		req.log.error(error.toString());
		res.send({ error });
	});

	return server;
}

export default createServer;
