import fastify from 'fastify';
import { LRUCache } from 'lru-cache';
import type { IncomingMessage } from 'node-types/http';
import { pino } from 'pino';
import { type ProxyOptions, Redbird } from 'redbird';

const GATE_PORT = Number(Deno.env.get('GATE_PORT') ?? '3000');
if (!Number.isInteger(GATE_PORT)) {
  throw new Error('!Number.isInteger(GATE_PORT)');
}
const META_PORT = Number(Deno.env.get('META_PORT') ?? '3001');
if (!Number.isInteger(META_PORT)) {
  throw new Error('!Number.isInteger(META_PORT)');
}

const logger = pino({ name: 'main', level: 'debug' });

const routes = new LRUCache<string, string>({ max: 1_000_000 });

const resolve: NonNullable<ProxyOptions['resolvers']>[0]['fn'] = (
  _host: string,
  url: string,
  req?: IncomingMessage,
) => {
  if (!req) return null;

  if (url === '/meta' || url.startsWith('/meta/')) {
    return `http://127.0.0.1:${META_PORT}`;
  }

  const query = new URL(url, 'http://dummy').searchParams;
  logger.debug(Array.from(query));
  const key = query.get('key');
  if (key && routes.has(key)) {
    return routes.get(key) as string;
  }

  req.method = 'GET';
  req.url = '/fallback/unknown';
  return `http://127.0.0.1:${META_PORT}`;
};

new Redbird({
  port: GATE_PORT,
  host: '0.0.0.0',
  logger: pino({ name: 'proxy', level: 'debug' }),
  resolvers: [{ fn: resolve, priority: 50 }],
});

const metaApp = fastify({ logger: { name: 'metaApp', level: 'debug' } });

metaApp.get('/meta', () => 'healthy');

metaApp.get('/fallback/unknown', (_, reply) => {
  reply.code(404).send('unknown');
});

// $ curl -i -X POST http://127.0.0.1:6780/meta/test/good\?foo\=bar\&foo\=baz -H 'Content-Type: application/json' -d '{"arr":[1,2,3]}'
metaApp.post<{
  Params: { id: string };
  Querystring: { foo?: string | string[] };
  Body: { arr: number[] };
  Reply: 'done';
}>('/meta/test/:id', (req, _reply) => {
  logger.debug({ params: req.params, body: req.body, query: req.query });
  return 'done';
});

metaApp.get<{
  Reply: [string, string][];
}>('/meta/routes', () => Array.from(routes.entries()));

metaApp.post<{
  Body: { key?: string };
  Reply: 'ok';
}>('/meta/routes', (req, reply) => {
  if (!req.body.key || typeof req.body.key !== 'string') {
    reply.code(400).send();
    return;
  }

  logger.debug(req.body);

  routes.set(req.body.key, 'http://127.0.0.1:3001');

  return 'ok';
});

metaApp.delete<{
  Params: { key: string };
  Reply: string | null;
}>('/meta/routes/:key', (req) => {
  const value = routes.get(req.params.key);
  routes.delete(req.params.key);
  return value || null;
});

metaApp
  .listen({ port: META_PORT, host: '0.0.0.0' })
  .catch(logger.error);
