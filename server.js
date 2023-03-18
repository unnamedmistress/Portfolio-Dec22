require('dotenv').config(); // load environment variables from .env file
const api = process.env.API_KEY;
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
