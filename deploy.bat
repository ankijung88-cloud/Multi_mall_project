@echo off
echo 🚀 Starting Deployment on Windows...

:: 1. Install Dependencies
echo 📦 Installing Dependencies...
call npm install
cd server
call npm install

:: 2. Database Migration
echo 🗄️ Applying Database Schema...
call npx prisma generate
call npx prisma db push

:: 3. Start Server
echo 🟢 Starting Server...
echo Server will run in this window. Do not close it.
node dist/server.js
