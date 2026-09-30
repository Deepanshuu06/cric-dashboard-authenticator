require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { LICENSES, evaluateLicense } = require('./licenses');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing (CORS) so your dashboard can call this API
app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------------------

/**
 * 1. Default Route: /
 * Returns normal service data and available client routes.
 */
app.get('/', (req, res) => {
  res.json({
    service: 'Cric Dashboard Authenticator API',
    status: 'ONLINE',
    version: '1.1.0',
    message: 'Authentication & license verification service is running normally.',
    serverTime: new Date().toISOString(),
    availableClients: Object.keys(LICENSES).map(slug => ({
      name: LICENSES[slug].clientName,
      slug: slug,
      url: `/${slug}`,
      rawUrl: `/${slug}/raw`
    })),
    healthCheck: '/health'
  });
});

/**
 * 2. Dedicated Route: /iqbal-sports
 * Returns full license details for Iqbal Sports
 */
app.get('/iqbal-sports', (req, res) => {
  const licenseInfo = evaluateLicense('iqbal-sports');
  res.json(licenseInfo);
});

/**
 * 3. Dedicated Raw Boolean Route: /iqbal-sports/raw
 * Returns plain text 'true' or 'false'
 */
app.get('/iqbal-sports/raw', (req, res) => {
  const licenseInfo = evaluateLicense('iqbal-sports');
  res.setHeader('Content-Type', 'text/plain');
  res.send(licenseInfo.isValid ? 'true' : 'false');
});

/**
 * 3. Dedicated Route: /crictalks
 */
app.get('/crictalks', (req, res) => {
  const licenseInfo = evaluateLicense('crictalks');
  res.json(licenseInfo);
});

app.get('/crictalks/raw', (req, res) => {
  const licenseInfo = evaluateLicense('crictalks');
  res.setHeader('Content-Type', 'text/plain');
  res.send(licenseInfo.isValid ? 'true' : 'false');
});

/**
 * 4. Dedicated Route: /openpath
 */
app.get('/openpath', (req, res) => {
  const licenseInfo = evaluateLicense('openpath');
  res.json(licenseInfo);
});

app.get('/openpath/raw', (req, res) => {
  const licenseInfo = evaluateLicense('openpath');
  res.setHeader('Content-Type', 'text/plain');
  res.send(licenseInfo.isValid ? 'true' : 'false');
});

/**
 * 4. General / Backward-Compatible Route: /license
 * Evaluates default license
 */
app.get('/license', (req, res) => {
  const licenseInfo = evaluateLicense('default');
  res.json(licenseInfo);
});

app.get('/license/raw', (req, res) => {
  const licenseInfo = evaluateLicense('default');
  res.setHeader('Content-Type', 'text/plain');
  res.send(licenseInfo.isValid ? 'true' : 'false');
});

/**
 * 5. Dynamic Client Route: /client/:slug
 * Allows adding any new client into licenses.js and fetching it immediately
 */
app.get('/client/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase().trim();
  const licenseInfo = evaluateLicense(slug);

  if (!licenseInfo) {
    return res.status(404).json({
      error: 'Client not found',
      message: `No license record found for client '${slug}'. Please add it to licenses.js.`,
      availableClients: Object.keys(LICENSES)
    });
  }

  res.json(licenseInfo);
});

/**
 * 6. Health Check / Keep-Alive Route (used by UptimeRobot / cron pingers)
 */
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
    console.log(`👉 Default Route:   http://localhost:${PORT}/`);
    console.log(`👉 Iqbal Sports:    http://localhost:${PORT}/iqbal-sports`);
    console.log(`👉 CricTalks:       http://localhost:${PORT}/crictalks`);
    console.log(`👉 OpenPath:        http://localhost:${PORT}/openpath`);
    console.log(`👉 Health Check:    http://localhost:${PORT}/health`);
  });
}

// Export for serverless environments (e.g. Vercel)
module.exports = app;
