// Load env vars first (critical for Vercel serverless)
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });

const app = require('../backend/server');

module.exports = app;
