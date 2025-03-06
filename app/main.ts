import fastify from 'fastify';
import { LRUCache } from 'lru-cache';
import { pino } from 'pino';

const PORT = Number(Deno.env.get('PORT') ?? '3001');
if (!Number.isInteger(PORT)) {
  throw new Error('!Number.isInteger(PORT)');
}

const logger = pino({ name: 'main', level: 'debug' });

const cache = new LRUCache<string, string>({ max: 1_000_000 });

const app = fastify({ logger: { name: 'fastify' } });

app.get('/', () => 'pong');
app.get('/health', () => 'healthy');

app.get('/404', (_, reply) => {
  reply.code(404).send('unknown');
});

// $ curl -i -X POST http://127.0.0.1:6780/test/good\?foo\=bar\&foo\=baz -H 'Content-Type: application/json' -d '{"arr":[1,2,3]}'
app.post<{
  Params: { id: string };
  Querystring: { foo?: string | string[] };
  Body: { arr: number[] };
  Reply: 'done';
}>('/test/:id', (req, _reply) => {
  logger.debug({ params: req.params, body: req.body, query: req.query });
  return 'done';
});

app.get<{
  Reply: [string, string][];
}>('/cache', () => Array.from(cache.entries()));

app.post<{
  Body: { key?: string };
  Reply: 'ok';
}>('/cache', (req, reply) => {
  if (!req.body.key || typeof req.body.key !== 'string') {
    reply.code(400).send();
    return;
  }

  logger.debug(req.body);

  cache.set(req.body.key, 'up');

  return 'ok';
});

app.delete<{
  Params: { key: string };
  Reply: string | null;
}>('/cache/:key', (req) => {
  const value = cache.get(req.params.key);
  cache.delete(req.params.key);
  return value || null;
});

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .catch(logger.error);
