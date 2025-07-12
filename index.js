require('dotenv').config();
require('./config/instrument.js');
const Sentry = require("@sentry/node");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URL;

// MongoDB connection
main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(uri);
}

// Clerk webhook controller
const webh = require('./config/webhooks.js');

// CORS
app.use(cors());

// ✅ Use raw body ONLY for webhook verification
app.post("/webhooks", express.raw({ type: 'application/json' }), webh);

// ✅ Use JSON body parser for all other routes
app.use(express.json());

// Sample routes
app.get('/', (req, res) => {
    res.send('working');
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// Optional: setup Sentry error handler (must be after all routes)
Sentry.setupExpressErrorHandler(app);
