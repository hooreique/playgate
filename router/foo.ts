import fastify from 'fastify';

const app = fastify({ logger: { name: 'foo', level: 'debug' } });

app.get('/', () => "I'm foo.");
app.get('/ping', () => 'pong');

app.listen({ host: '0.0.0.0', port: 3001 });
