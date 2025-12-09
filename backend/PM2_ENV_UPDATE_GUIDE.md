# PM2 Environment Variables Update Guide

## Problem
PM2 caches environment variables, so when you update `.env` file, changes might not reflect even after `pm2 restart --update-env`.

## Solutions

### Solution 1: Delete and Restart (Recommended)
```bash
# Stop and delete the PM2 process
pm2 delete Appzeto-Backend

# Start fresh with updated .env file
pm2 start ecosystem.config.js

# Check status
pm2 status
pm2 logs Appzeto-Backend
```

### Solution 2: Reload with Update Env
```bash
# Reload with environment update
pm2 reload Appzeto-Backend --update-env

# Or restart with update
pm2 restart Appzeto-Backend --update-env
```

### Solution 3: Kill PM2 and Restart
```bash
# Kill all PM2 processes
pm2 kill

# Start fresh
pm2 start ecosystem.config.js
```

### Solution 4: Verify .env File is Loaded
```bash
# Check if .env file exists
ls -la backend/.env

# View .env file (be careful with sensitive data)
cat backend/.env | grep MONGODB_URI

# Check PM2 environment variables
pm2 env Appzeto-Backend
```

## Important Notes

1. **Server.js loads .env automatically**: The `server.js` file loads `.env` file using `dotenv.config()`, so PM2 doesn't need to load it separately.

2. **Always delete and restart for .env changes**: For guaranteed .env updates, use `pm2 delete` then `pm2 start`.

3. **Check logs**: After restart, check logs to verify MongoDB URI is loaded correctly:
   ```bash
   pm2 logs Appzeto-Backend --lines 50
   ```

4. **Verify MongoDB connection**: Look for this in logs:
   ```
   ✅ Loaded .env file from: /path/to/.env
   🗄️ DATABASE CONNECTION ESTABLISHED
   🌐 Host: ac-yyiplx1-shard-00-00.vg2zbcm.mongodb.net
   ```

## Quick Fix Command
```bash
cd /root/Appzeto/backend
pm2 delete Appzeto-Backend
pm2 start ecosystem.config.js
pm2 logs Appzeto-Backend --lines 20
```

