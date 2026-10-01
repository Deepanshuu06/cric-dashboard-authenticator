# Cric Dashboard Authenticator 🏏

A modular Node.js API service designed to verify multi-client license validity, issue dates, expiry dates, remaining days, and feature access for your cricket dashboards.

---

## 🚀 API Endpoints

### 1. Default Overview (`/`)
Returns standard service health and registered client routes:
```bash
curl http://localhost:3000/
```
```json
{
  "service": "Cric Dashboard Authenticator API",
  "status": "ONLINE",
  "version": "1.1.0",
  "message": "Authentication & license verification service is running normally.",
  "serverTime": "2026-10-01T05:25:00.000Z",
  "availableClients": [
    {
      "name": "Iqbal Sports",
      "slug": "iqbal-sports",
      "url": "/iqbal-sports",
      "rawUrl": "/iqbal-sports/raw"
    },
    {
      "name": "Standard Cric Client",
      "slug": "default",
      "url": "/default",
      "rawUrl": "/default/raw"
    }
  ],
  "healthCheck": "/health"
}
```

---

### 2. Iqbal Sports Route (`/iqbal-sports`)
Full license verification response:
```bash
curl http://localhost:3000/iqbal-sports
```
```json
{
  "client": "Iqbal Sports",
  "slug": "iqbal-sports",
  "licensed": true,
  "isValid": true,
  "status": "ACTIVE",
  "message": "License is valid and active.",
  "licenseKey": "IQBAL-SPORTS-2026-PRO-9811",
  "plan": "Pro Enterprise Annual",
  "issuedDate": "2026-01-01",
  "expiryDate": "2027-01-01",
  "daysRemaining": 94,
  "features": [
    "live_score_sync",
    "tournament_management",
    "commentary_feed",
    "player_profiles",
    "team_rankings",
    "admin_dashboard_access"
  ],
  "allowedDomains": [
    "*"
  ],
  "contact": "contact to developer",
  "checkedAt": "2026-10-01T05:25:00.000Z"
}
```

---

### 3. CricTalks Route (`/crictalks`)
```bash
curl http://localhost:3000/crictalks
```
* **Raw Check**: `curl http://localhost:3000/crictalks/raw` (returns `true` or `false`)

---

### 4. OpenPath Route (`/openpath`)
```bash
curl http://localhost:3000/openpath
```
* **Raw Check**: `curl http://localhost:3000/openpath/raw` (returns `true` or `false`)

---

### 5. Raw Boolean Endpoints (Quick Check)
Every client has a `/raw` endpoint that returns plain text `true` or `false` based on `isValid`. Perfect for quick one-line checks in your dashboard code:
```bash
curl http://localhost:3000/iqbal-sports/raw
curl http://localhost:3000/crictalks/raw
curl http://localhost:3000/openpath/raw
```

---

### 4. Dynamic Client Route (`/client/:slug`)
Allows you to query any client registered in `licenses.js`:
```bash
curl http://localhost:3000/client/iqbal-sports
curl http://localhost:3000/client/default
```

---

### 5. Health Check / Ping (`/health`)
Used by uptime monitors (e.g. UptimeRobot) to keep free hosts awake 24/7:
```json
{
  "status": "ok",
  "uptimeSeconds": 120,
  "timestamp": "2026-10-01T05:25:00.000Z"
}
```

---

## ⚙️ How to Configure Licenses & Expiry Dates

All client records live in **`licenses.js`**:

```javascript
// licenses.js
const LICENSES = {
  'iqbal-sports': {
    clientName: 'Iqbal Sports',
    licensed: true,             // 👈 Set to false to immediately deactivate
    licenseKey: 'IQBAL-SPORTS-2026-PRO-9811',
    plan: 'Pro Enterprise Annual',
    issuedDate: '2026-01-01',   // YYYY-MM-DD
    expiryDate: '2027-01-01',   // YYYY-MM-DD (auto-calculates daysRemaining & isValid)
    features: [
      'live_score_sync',
      'tournament_management',
      'commentary_feed',
      'player_profiles',
      'admin_dashboard_access'
    ],
    allowedDomains: ['*']
  }
};
```

### 🧠 How `isValid` is Calculated Automatically
1. **Killswitch Check**: If `licensed: false`, `isValid` is immediately `false` and status is `'REVOKED'`.
2. **Date Check**: If current server date passes `expiryDate`, `isValid` automatically switches to `false`, `daysRemaining` becomes `0`, and status becomes `'EXPIRED'`.
3. **Active Check**: If `licensed: true` and the expiry date has not passed, `isValid` is `true` and status is `'ACTIVE'`.

---

## 🌐 24/7 Free Hosting Setup

### Option 1: Vercel (Recommended — Never Sleeps, Free Forever)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "update: add multi-client license support"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) > **"Add New"** > **"Project"** > Import repo > Click **Deploy**.
3. Your endpoints are immediately active 24/7 with zero sleeping:
   - `https://your-domain.vercel.app/`
   - `https://your-domain.vercel.app/iqbal-sports`
   - `https://your-domain.vercel.app/iqbal-sports/raw`

### Option 2: Render.com + UptimeRobot (Free 24/7 Keep-Alive Trick)
1. Deploy on [render.com](https://render.com) as a free Web Service.
2. In [uptimerobot.com](https://uptimerobot.com), create a free HTTP monitor pointing to `https://your-app.onrender.com/health` running every 5 minutes.
3. This keeps your Render instance awake 24/7 for free!
