# LIFEVERSE — Production Deployment & DevOps Guide

## 1. System Requirements

### Recommended Hardware Specs (Ubuntu 22.04 / 24.04 LTS)
- **CPU:** 4+ Cores (x86_64 or ARM64)
- **RAM:** 8 GB minimum (16 GB recommended for concurrent builds)
- **Storage:** 50 GB NVMe SSD
- **Network:** High-speed internet access with ports `80`, `443`, and `5000` (or reverse proxied).

### Core Software Stack
- **Node.js:** v20.x or v22.x LTS (tested up to v24.x)
- **MongoDB:** 6.0+ / 7.0+
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx with HTTP/2 and WebSocket support
- **SSL/TLS:** Let's Encrypt Certbot

---

## 2. Bare-Metal Ubuntu Setup

### 2.1 Install Node.js & Dependencies
```bash
# Update Ubuntu package manager
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx

# Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22

# Install PM2 globally
npm install -g pm2
```

### 2.2 Install & Configure MongoDB
```bash
# Import MongoDB public GPG Key & install
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org

# Enable and start MongoDB service
sudo systemctl enable mongod
sudo systemctl start mongod
```

### 2.3 Clone Repository & Install Dependencies
```bash
cd /var/www
git clone https://github.com/your-org/LIFEVERSE.git lifeverse
cd lifeverse

# Install monorepo dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
nano .env
```

### 2.4 Seed Initial Admin & Catalog Data
```bash
cd server
npm run seed
```

### 2.5 Build Web Frontend
```bash
# Build the production React Vite bundle into apps/web/dist
npm --workspace=apps/web run build
```

---

## 3. Production Process Management (PM2)

Create an `ecosystem.config.cjs` in the root:

```javascript
module.exports = {
  apps: [
    {
      name: 'lifeverse-server',
      script: './server/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

Launch with PM2:
```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## 4. Nginx Reverse Proxy & WebSocket Configuration

Create `/etc/nginx/sites-available/lifeverse`:

```nginx
# Upstream Node.js cluster
upstream lifeverse_backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

server {
    listen 80;
    server_name lifeverse.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lifeverse.yourdomain.com;

    # SSL Certificates (managed by certbot)
    ssl_certificate /etc/letsencrypt/live/lifeverse.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lifeverse.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Static Web Frontend
    root /var/www/lifeverse/apps/web/dist;
    index index.html;

    # Web SPA Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # REST API Gateway
    location /api/ {
        proxy_pass http://lifeverse_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Gateway (Socket.IO)
    location /socket.io/ {
        proxy_pass http://lifeverse_backend/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/lifeverse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. Docker Deployment (Optional)

A complete `docker-compose.yml` can be used to run the entire stack:

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7.0
    restart: always
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  server:
    build:
      context: .
      dockerfile: ./server/Dockerfile
    restart: always
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/lifeverse
      - PORT=5000
    depends_on:
      - mongo
    ports:
      - "5000:5000"

  web:
    build:
      context: .
      dockerfile: ./apps/web/Dockerfile
    restart: always
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  mongo_data:
```

---

## 6. Database Backup & Disaster Recovery

### Automated Nightly MongoDB Dump
Create `/usr/local/bin/backup-lifeverse.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Perform mongodump
mongodump --db lifeverse --out "$BACKUP_DIR/backup_$TIMESTAMP"
# Compress
tar -czf "$BACKUP_DIR/lifeverse_$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "backup_$TIMESTAMP"
rm -rf "$BACKUP_DIR/backup_$TIMESTAMP"

# Retain only last 14 days of backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +14 -exec rm {} \;
```
Set executable and add to crontab:
```bash
chmod +x /usr/local/bin/backup-lifeverse.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-lifeverse.sh") | crontab -
```
