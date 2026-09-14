const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDB, getIsConnected } = require('./config/db');
const models = require('./models');
const { seedMongoDB } = require('./utils/seeder');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auto-connect DB middleware for Vercel / serverless environment
app.use(async (req, res, next) => {
  if (!getIsConnected()) {
    const connected = await connectDB();
    if (connected) {
      await seedMongoDB(models);
    }
  }
  next();
});

// API Routes
app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'MERN Hospital Management System API',
    databaseConnected: getIsConnected(),
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date()
  });
});

// Serve static frontend build in production
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Start Server locally
if (require.main === module || !process.env.VERCEL) {
  const startServer = async () => {
    const connected = await connectDB();
    if (connected) {
      await seedMongoDB(models);
    }
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  MERN HMS Server running on port ${PORT} [${process.env.NODE_ENV || 'production'}]`);
      console.log(`  Health check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  };
  startServer();
}

module.exports = app;

