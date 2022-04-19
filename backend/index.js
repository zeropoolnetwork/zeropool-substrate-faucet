const handlers = require('./handlers');
const fastify = require('fastify')({ logger: true });

fastify.register(require('fastify-cors'));

fastify.get('/api/claim', handlers.claim);

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
