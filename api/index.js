const serverless = require('serverless-http');
const express = require('express');
const app = express();

// Example routes
app.get('/', (req, res) => {
  res.send('API is working!');
});

module.exports = serverless(app);
