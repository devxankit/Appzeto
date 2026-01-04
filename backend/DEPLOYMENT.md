# Simple VPS Deployment Guide

## Quick Start

1. **Copy .env file** (if not exists, copy from env.example):
   ```bash
   cp env.example .env
   ```

2. **Edit .env file** with your configuration:
   ```bash
   nano .env
   ```

3. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

4. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.js
   ```

5. **Save PM2 configuration** (so it auto-starts on server reboot):
   ```bash
   pm2 save
   pm2 startup
   ```

## Common Commands

```bash
# Start the application
pm2 start ecosystem.config.js

# Restart (picks up .env changes automatically)
pm2 restart Appzeto-Backend

# Stop
pm2 stop Appzeto-Backend

# View logs
pm2 logs Appzeto-Backend

# View status
pm2 status

# Monitor
pm2 monit
```

## Updating Environment Variables

1. **Edit .env file**:
   ```bash
   nano .env
   ```

2. **Restart PM2**:
   ```bash
   pm2 restart Appzeto-Backend
   ```

That's it! Standard Node.js deployment - .env file is loaded automatically when the app starts.

## Notes

- All environment variables are loaded from `.env` file by `server.js` (standard Node.js practice)
- PM2 ecosystem.config.js is minimal - just runs the app, no env vars set
- Edit `.env` and restart - changes take effect immediately
- Standard Node.js + PM2 deployment - simple and reliable

