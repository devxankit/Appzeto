# Nginx CORS Configuration for Appzeto Backend

If you're using Nginx as a reverse proxy in front of your Node.js backend, you need to ensure that:

1. **OPTIONS requests are forwarded to Node.js** (not handled by Nginx)
2. **CORS headers are passed through** from the backend
3. **No conflicting CORS headers** are added by Nginx

## Required Nginx Configuration

Add this to your Nginx server block configuration:

```nginx
server {
    listen 80;
    server_name api.supercrm.appzeto.com;

    # Forward all requests including OPTIONS to Node.js backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # IMPORTANT: Don't add CORS headers here - let Node.js handle them
        # The backend will set proper CORS headers
        
        # Ensure OPTIONS requests are forwarded (not handled by Nginx)
        # This is the default behavior, but make sure you're not blocking them
    }
}
```

## If Nginx is Handling OPTIONS (NOT RECOMMENDED)

If you absolutely must handle OPTIONS in Nginx (not recommended), you would need:

```nginx
# Handle OPTIONS requests
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Max-Age' 86400 always;
    add_header 'Content-Length' 0;
    add_header 'Content-Type' 'text/plain';
    return 204;
}
```

**However, this is NOT recommended** because:
- It duplicates CORS logic
- It's harder to maintain
- The Node.js backend already handles CORS properly

## Best Practice

**Let Node.js handle all CORS** - Just forward all requests (including OPTIONS) to Node.js and let the backend handle CORS headers.

## Testing

After updating Nginx config:

1. Reload Nginx: `sudo nginx -t && sudo systemctl reload nginx`
2. Restart PM2: `pm2 restart Appzeto-Backend`
3. Test with curl:
   ```bash
   curl -X OPTIONS https://api.supercrm.appzeto.com/admin/login \
     -H "Origin: https://supercrm.appzeto.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -v
   ```
   
   You should see `Access-Control-Allow-Origin` in the response headers.

## Troubleshooting

If CORS still doesn't work:

1. Check if OPTIONS requests are reaching Node.js:
   ```bash
   pm2 logs Appzeto-Backend --lines 100 | grep OPTIONS
   ```

2. Test direct connection (bypassing Nginx):
   ```bash
   curl -X OPTIONS http://localhost:5000/admin/login \
     -H "Origin: https://supercrm.appzeto.com" \
     -H "Access-Control-Request-Method: POST" \
     -v
   ```

3. Check Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. Verify Nginx config:
   ```bash
   sudo nginx -t
   ```

