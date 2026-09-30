# Cric Dashboard Authenticator 🏏

A lightweight Node.js API service designed to verify license status for your application or dashboard.

---

## 🚀 API Endpoints

| Endpoint | Method | Output | Description |
| :--- | :---: | :--- | :--- |
| `/license` | `GET` | JSON | Returns `{ "licensed": true/false, "status": "ACTIVE"/"INACTIVE", "message": "...", "timestamp": "..." }` |
| `/license/raw` | `GET` | Plain Text | Returns `true` or `false` (ideal for lightweight string checks) |
| `/health` | `GET` | JSON | Returns `{ "status": "ok", "uptimeSeconds": ... }` (used by keep-alive pingers) |
| `/` | `GET` | JSON | Service overview and available endpoints |

---

## ⚙️ How to Change the License (`true` or `false`)

You have two easy ways to change the license status:

### Method 1: Directly in Code (`server.js`)
Open [server.js](file:///server.js) and update line 16:
```javascript
// Change this to true or false:
const DEFAULT_IS_LICENSED = true; 
```

### Method 2: Via Environment Variable (Recommended for Cloud Hosting)
In your hosting dashboard (e.g. Render, Vercel, Koyeb) or in your `.env` file, set:
```env
IS_LICENSED=true
```
*(or `IS_LICENSED=false` to deactivate)*

No code redeployment is needed when changing environment variables in cloud dashboards!

---

## 💻 Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```
Or for auto-reloading on changes:
```bash
npm run dev
```

### 3. Test the endpoints
Open your browser or run in terminal:
```bash
curl http://localhost:3000/license
```

---

## 🌐 Where to Host for FREE (Active 24/7)

Here are the best free hosting solutions that stay active all the time:

---

### Option 1: Vercel (Recommended - Zero Sleep, Always Active)
Vercel is serverless, meaning **it never sleeps or goes inactive**, responds instantly worldwide, and has a generous free tier (100k requests/day).

1. Push this project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # push to your GitHub repo
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New"** > **"Project"**.
3. Import your GitHub repository.
4. Click **Deploy**.
5. Once deployed, your API is live at `https://your-project.vercel.app/license`.
6. To toggle license without editing code:
   - Go to your Vercel Project > **Settings** > **Environment Variables**.
   - Add `IS_LICENSED` with value `true` or `false`.
   - Redeploy or trigger deploy to apply.

---

### Option 2: Render.com + UptimeRobot (Free 24/7 Keep-Alive Trick)
Render provides free Node.js Web Services, but spins down after 15 minutes of inactivity on the free tier. You can keep it **active 24/7** using a free pinging service!

1. Create a free account at [render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Click **Create Web Service**. You will get a URL like `https://cric-auth.onrender.com`.

#### 💡 The 24/7 Keep-Alive Trick:
1. Go to [uptimerobot.com](https://uptimerobot.com) (or [cron-job.org](https://cron-job.org)) and create a free account.
2. Click **Add New Monitor**:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `Cric Authenticator KeepAlive`
   - **URL**: `https://your-service.onrender.com/health`
   - **Monitoring Interval**: `Every 5 minutes`
3. Save the monitor. UptimeRobot will ping `/health` every 5 minutes, preventing Render from ever going to sleep!

---

### Option 3: Koyeb (Free Eco Tier - Always Online)
Koyeb provides 1 free Eco Web service that runs 24/7 without sleeping.

1. Go to [koyeb.com](https://koyeb.com) and create an account.
2. Create an App > Select **GitHub** > Choose your repo.
3. Build type: **Buildpack** (Node.js).
4. Deploy! It will remain online 24/7 on Koyeb's global infrastructure.
