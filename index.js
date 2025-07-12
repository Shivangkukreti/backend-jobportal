const express = require('express');
const app = express();
const webh = require('./config/webhooks.js');
const cors = require('cors');

// ✅ Allow CORS
app.use(cors());

// ✅ Use raw ONLY for the /webhooks route
app.post("/webhooks", express.raw({ type: 'application/json' }), webh);

// ✅ Use JSON for all other routes
app.use(express.json());

// ✅ Your test route
app.get('/', (req, res) => {
  res.send('working');
});
