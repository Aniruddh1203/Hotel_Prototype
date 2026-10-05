// Auto-install dependencies if node_modules is missing
const fs = require('fs');
const path = require('path');
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 node_modules missing. Installing dependencies...');
  require('child_process').execSync('npm install', { stdio: 'inherit', cwd: __dirname });
}

const express = require('express');
const dotenv = require('dotenv');
const { verifyTransporter } = require('./config/mailer');
const apiRoutes = require('./routes/apiRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (index.html, book.html, style.css, script.js, photos)
app.use(express.static(__dirname));

// API Routes
app.use('/api', apiRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server & Verify Mailer Transporter
app.listen(PORT, async () => {
  console.log(`🚀 [Server]: Server is running on http://localhost:${PORT}`);
  
  // Verify SMTP Connection on Startup (Non-blocking check)
  await verifyTransporter();
});
