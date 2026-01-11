#!/bin/bash

# Deployment Script for Linux Server
echo "🚀 Starting Deployment..."

# 1. Install Dependencies
echo "📦 Installing Dependencies..."
npm install
cd server
npm install

# 2. Database Migration
echo "🗄️ Applying Database Schema..."
npx prisma generate
npx prisma db push

# 3. Start Server with PM2 (or node)
echo "🟢 Starting Server..."
# Check if PM2 is installed
if command -v pm2 &> /dev/null
then
    pm2 stop jobproject-server || true
    pm2 start dist/server.js --name "jobproject-server"
    pm2 save
    echo "✅ Server started with PM2"
else
    echo "⚠️ PM2 not found. Starting with node (background)..."
    nohup node dist/server.js > server.log 2>&1 &
    echo "✅ Server started with Node"
fi

echo "🎉 Deployment Complete!"
echo "Frontend is served via Static Files or Nginx."
echo "Backend is running on port 3000."
