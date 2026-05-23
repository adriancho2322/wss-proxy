const http = require('http');
const WebSocket = require('ws');
const net = require('net');

const PORT = process.env.PORT || 10000;
const TARGET_HOST = 'webdial.keepcalling.net';
const TARGET_PORT = 5060;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WSS Proxy running');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const client = net.connect(TARGET_PORT, TARGET_HOST, () => {
    console.log('TCP connected to', TARGET_HOST);
  });

  ws.on('message', (data) => {
    if (typeof data === 'string') {
      client.write(data);
    } else {
      client.write(data);
    }
  });

  client.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
    client.destroy();
  });

  client.on('close', () => {
    console.log('TCP closed');
    ws.close();
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    client.destroy();
  });

  client.on('error', (err) => {
    console.error('TCP error:', err.message);
    ws.close();
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WSS Proxy listening on port ${PORT}`);
});
