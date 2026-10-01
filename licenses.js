/**
 * License Database & Configuration
 * 
 * Edit this file to add clients, change expiry dates, 
 * or toggle `licensed: true / false`.
 */

// ==============================================================================
// 👨‍💻 DEVELOPER CONTACT
// This is the sole contact returned across all license endpoints.
// You can edit details directly here or set environment variables.
// ==============================================================================
const DEVELOPER_CONTACT = {
  name: 'Developer Support',
  email: process.env.DEVELOPER_EMAIL || 'developer@example.com',
  phone: process.env.DEVELOPER_PHONE || '+91 98765 43210',
  whatsapp: process.env.DEVELOPER_WHATSAPP || '+91 98765 43210',
  telegram: process.env.DEVELOPER_TELEGRAM || '@cric_dashboard_dev',
  message: 'For license renewal, key activation, or issues, please contact the developer directly.'
};

const LICENSES = {
  // Client: Iqbal Sports
  'iqbal-sports': {
    clientName: 'Iqbal Sports',
    licensed: true, // 👈 Change to false to manually disable license
    licenseKey: 'IQBAL-SPORTS-2026-PRO-9811',
    plan: 'Pro Enterprise Annual',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01', // YYYY-MM-DD
    features: [
      'live_score_sync',
      'tournament_management',
      'commentary_feed',
      'player_profiles',
      'team_rankings',
      'admin_dashboard_access'
    ],
    allowedDomains: ['*']
  },

  // Client: CricTalks
  'crictalks': {
    clientName: 'CricTalks',
    licensed: true, // 👈 Change to false to manually disable license
    licenseKey: 'CRICTALKS-2026-PRO-4421',
    plan: 'Pro Cricket Broadcast',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01', // YYYY-MM-DD
    features: [
      'live_score_sync',
      'commentary_feed',
      'news_integration',
      'social_sharing',
      'admin_dashboard_access'
    ],
    allowedDomains: ['*']
  },

  // Client: OpenPath
  'openpath': {
    clientName: 'OpenPath',
    licensed: true, // 👈 Change to false to manually disable license
    licenseKey: 'OPENPATH-2026-ENT-7732',
    plan: 'Enterprise Analytics',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01', // YYYY-MM-DD
    features: [
      'live_score_sync',
      'realtime_analytics',
      'custom_api_access',
      'tournament_brackets',
      'admin_dashboard_access'
    ],
    allowedDomains: ['*']
  },

  // Default / Demo license
  'default': {
    clientName: 'Standard Cric Client',
    licensed: true, // 👈 Change to false to disable
    licenseKey: 'CRIC-DEFAULT-2026-STANDARD',
    plan: 'Standard Plan',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01',
    features: [
      'live_score_sync',
      'player_profiles',
      'admin_dashboard_access'
    ],
    allowedDomains: ['*']
  }
};

/**
 * Evaluates license validity, remaining days, and status.
 *
 * @param {string} clientKey - Client identifier (e.g. 'iqbal-sports')
 * @returns {object|null} Evaluated license details or null if client not found
 */
function evaluateLicense(clientKey) {
  const license = LICENSES[clientKey];
  if (!license) return null;

  // Check for environment variable override (e.g., IQBAL_SPORTS_LICENSED=false or IS_LICENSED=false)
  const envVarKey = `${clientKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_LICENSED`;
  let isLicensed = license.licensed;
  if (process.env[envVarKey] !== undefined) {
    isLicensed = process.env[envVarKey].trim().toLowerCase() === 'true';
  } else if (process.env.IS_LICENSED !== undefined) {
    isLicensed = process.env.IS_LICENSED.trim().toLowerCase() === 'true';
  }

  const now = new Date();
  const expiry = new Date(license.expiryDate + 'T23:59:59Z');
  const diffMs = expiry - now;
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = diffMs < 0;

  // isValid is true only if licensed is true AND license hasn't expired
  const isValid = Boolean(isLicensed) && !isExpired;

  let status = 'ACTIVE';
  let message = 'License is valid and active.';

  if (!isLicensed) {
    status = 'REVOKED';
    message = 'License has been manually disabled or revoked.';
  } else if (isExpired) {
    status = 'EXPIRED';
    message = `License expired on ${license.expiryDate}. Please renew.`;
  }

  return {
    client: license.clientName,
    slug: clientKey,
    licensed: isLicensed,
    isValid: isValid,
    status: status,
    message: message,
    licenseKey: license.licenseKey,
    plan: license.plan,
    issuedDate: license.issuedDate,
    expiryDate: license.expiryDate,
    daysRemaining: isExpired ? 0 : daysRemaining,
    features: license.features,
    allowedDomains: license.allowedDomains,
    contactDeveloper: DEVELOPER_CONTACT,
    checkedAt: now.toISOString()
  };
}

module.exports = {
  LICENSES,
  DEVELOPER_CONTACT,
  evaluateLicense
};
