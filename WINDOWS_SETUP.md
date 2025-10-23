# Windows Local Setup Guide

This guide will help you install and run MongoDB and Redis locally on Windows without Docker.

## 📥 MongoDB Installation

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0 (or latest)
   - Platform: Windows
   - Package: MSI
3. Click **Download**

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose **Complete** setup type
3. **IMPORTANT**: Check these options:
   - ✅ Install MongoDB as a Service
   - ✅ Run service as Network Service user
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log\`
4. ✅ Install MongoDB Compass (optional GUI tool)
5. Complete installation

### Step 3: Verify MongoDB is Running
```powershell
# Check service status
Get-Service MongoDB

# Should show:
# Status   Name               DisplayName
# ------   ----               -----------
# Running  MongoDB            MongoDB

# Test connection
mongosh
# You should connect to: mongodb://localhost:27017
```

### Step 4: Start/Stop MongoDB (if needed)
```powershell
# Start MongoDB
Start-Service MongoDB

# Stop MongoDB
Stop-Service MongoDB

# Restart MongoDB
Restart-Service MongoDB
```

---

## 📥 Redis Installation (Memurai - Redis for Windows)

### Step 1: Download Memurai
1. Go to: https://www.memurai.com/get-memurai
2. Click **Download** (free version)
3. Fill in the form and download the installer

### Step 2: Install Memurai
1. Run the downloaded installer
2. Follow the installation wizard
3. It will automatically:
   - Install as Windows service
   - Start on system boot
   - Listen on port 6379

### Step 3: Verify Memurai is Running
```powershell
# Check service status
Get-Service Memurai

# Should show:
# Status   Name               DisplayName
# ------   ----               -----------
# Running  Memurai            Memurai

# Test connection (if redis-cli is in PATH)
redis-cli ping
# Should return: PONG
```

### Step 4: Start/Stop Memurai (if needed)
```powershell
# Start Memurai
Start-Service Memurai

# Stop Memurai
Stop-Service Memurai

# Restart Memurai
Restart-Service Memurai
```

---

## 🚀 Running the Application

### Step 1: Install Dependencies
```powershell
cd C:\GitLab\payment_analytics
npm install
```

### Step 2: Verify MongoDB and Redis are Running
```powershell
# Check both services
Get-Service MongoDB, Memurai

# Both should show "Running" status
```

### Step 3: Seed the Database
```powershell
npm run seed
```

You should see:
```
🌱 Connecting to MongoDB...
📝 Generating payments...
✅ Successfully created 1000 payments
📊 Breakdown:
   - Completed: 750
   - Failed: 150
   - Refunded: 50
   - Pending: 50
```

### Step 4: Start the API Server
```powershell
# Terminal 1
npm run dev:api
```

You should see:
```
✅ Redis connected
🚀 API server running on http://localhost:3001
📊 Analytics endpoint: http://localhost:3001/api/analytics
🔌 WebSocket endpoint: ws://localhost:3001/ws/payments
💳 Real-time payment simulation started (every 3 seconds)
```

### Step 5: Start the Web Application
```powershell
# Terminal 2 (new PowerShell window)
npm run dev:web
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
✓ Ready in 5.2s
```

### Step 6: Open Dashboard
Open your browser to: **http://localhost:3000**

---

## ❓ Troubleshooting

### Problem: MongoDB won't start

**Solution 1: Check if port 27017 is in use**
```powershell
netstat -ano | findstr :27017
```

**Solution 2: Check MongoDB logs**
```powershell
Get-Content "C:\Program Files\MongoDB\Server\7.0\log\mongod.log" -Tail 50
```

**Solution 3: Recreate data directory**
```powershell
Stop-Service MongoDB
Remove-Item "C:\Program Files\MongoDB\Server\7.0\data\*" -Recurse -Force
Start-Service MongoDB
```

### Problem: Redis/Memurai won't connect

**Solution 1: Check if port 6379 is in use**
```powershell
netstat -ano | findstr :6379
```

**Solution 2: Restart Memurai**
```powershell
Restart-Service Memurai
```

**Solution 3: Check Memurai logs**
- Open Windows Event Viewer
- Go to: Windows Logs → Application
- Filter by source: "Memurai"

### Problem: API shows "Redis not available"

This is OK! The application will work without Redis, just without caching:
```
⚠️ Redis not available, caching disabled
```

The dashboard will still work, queries will just be slower.

### Problem: Database connection timeout

Update MongoDB URI in `.env` file:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/payment-analytics
```

Then restart the API.

---

## 🎉 You're All Set!

Your dashboard should now be running with:
- ✅ MongoDB storing real payment data
- ✅ Redis caching analytics queries
- ✅ WebSocket broadcasting real-time events
- ✅ Next.js dashboard showing live metrics

Enjoy your real-time payment analytics dashboard! 🚀
