const WebSocket = require('ws');

const port = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8081;
const wss = new WebSocket.Server({ port });

function broadcastVisitors() {
  const payload = JSON.stringify({ type: 'visitors', count: wss.clients.size });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}

wss.on('connection', (ws) => {
  // Send the current count right away
  broadcastVisitors();

  ws.on('message', (message) => {
    // Reserved for future messages from client (e.g., admin reset)
    try {
      const data = JSON.parse(message);
      if (data && data.type === 'reset' && process.env.ALLOW_RESET === '1') {
        // no-op for now (we're using connection count as visitors)
      }
    } catch (e) {}
  });

  ws.on('close', () => {
    broadcastVisitors();
  });
});

console.log(`WebSocket server running on ws://localhost:${port}`);
