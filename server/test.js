const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Test server running' });
});

app.get('/test/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.listen(3000, () => {
  console.log('Test server running on port 3000');
}); 