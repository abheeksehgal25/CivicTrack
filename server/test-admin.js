const express = require('express');
const app = express();

// Test admin routes
app.get('/test-admin', (req, res) => {
  res.json({ message: 'Admin routes test successful' });
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
}); 