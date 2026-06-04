import http from 'node:http';
import os from 'node:os';


const DEFAULT_PORT = 8000;
const PORT = Number(process.env.PING_LISTEN_PORT) || DEFAULT_PORT;
const INSTANCE_ID = process.env.INSTANCE_ID || os.hostname();

interface CounterStore {
  increment(): Promise<number>;
  total(): Promise<number>;
}

class InMemoryCounterStore implements CounterStore {
  #count = 0;

  async increment(): Promise<number> {
    return ++this.#count;
  }

  async total(): Promise<number> {
    return this.#count;
  }
}

const counter: CounterStore = new InMemoryCounterStore();

const server = http.createServer(async (req, res) => {
  await counter.increment();

  const url = new URL(req.url ?? '', `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.headers));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/stats') {
    const stats = {
      requests: await counter.total(),
      uptime: Math.floor(process.uptime()),
      instance: INSTANCE_ID,
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Serveur à l'écoute sur le port ${PORT} (instance ${INSTANCE_ID})`);
});