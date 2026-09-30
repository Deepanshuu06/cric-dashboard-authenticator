require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing (CORS) so your dashboard can call this API
app.use(cors());
app.use(express.json());

// ==============================================================================
// ⚙️ LICENSE SETTING: Set to `true` or `false`
// ==============================================================================
// You can directly change this variable below:
const DEFAULT_IS_LICENSED = true;

/**
 * Returns current license state.
 * Uses environment variable IS_LICENSED if provided, otherwise DEFAULT_IS_LICENSED.
 */
function checkLicense() {
  if (process.env.IS_LICENSED !== undefined) {
    return process.env.IS_LICENSED.trim().toLowerCase() === 'true';
  }
  return DEFAULT_IS_LICENSED;
}

// ------------------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------------------

// Root route: Overview & quick check
app.get('/', (req, res) => {
  const licensed = checkLicense();
  res.json({
    service: 'Cric Dashboard Authenticator',
    licensed: licensed,
    endpoints: {
      license: '/license',
      rawBoolean: '/license/raw',
      health: '/health'
    }
  });
});

// Primary license check route: JSON format
app.get('/license', (req, res) => {
  const licensed = checkLicense();
  res.json({
    licensed: licensed,
    status: licensed ? 'ACTIVE' : 'INACTIVE',
    message: licensed ? 'License is verified and active.' : 'License is inactive or expired.',
    timestamp: new Date().toISOString()
  });
});

// Raw route: Returns plain true or false as string
app.get('/license/raw', (req, res) => {
  const licensed = checkLicense();
  res.setHeader('Content-Type', 'text/plain');
  res.send(licensed ? 'true' : 'false');
});

// Health check / Keep-Alive route (used by UptimeRobot / cron pingers)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ------------------------------------------------------------------------------
// Server Startup
// ------------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Cric Dashboard Authenticator is running on port ${PORT}`);
    console.log(`🔑 Current License Status: ${checkLicense() ? 'LICENSED (true)' : 'UNLICENSED (false)'}`);
    console.log(`👉 Test endpoint: http://localhost:${PORT}/license`);
  });
}

// Export for serverless environments (e.g. Vercel)
module.exports = app;
