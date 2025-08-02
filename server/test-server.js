const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Test server is working!' }));
});

server.listen(3001, '0.0.0.0', () => {
  console.log('Test server running on port 3001');
}); 