# Real-Time Payment Analytics Dashboard# Real-Time Payment Analytics Dashboard# Real-Time Payment Analytics Dashboard# Payment Analytics Dashboard



A full-stack real-time payment analytics dashboard built with **Next.js**, **NestJS**, **MongoDB**, **Redis**, and **WebSockets**.



## 🚀 Quick StartA full-stack real-time payment analytics dashboard built with **Next.js**, **NestJS**, **MongoDB**, **Redis**, and **WebSockets**.



### Prerequisites

- Node.js 18+ 

- MongoDB Community Edition (running locally)## 🚀 Quick StartA full-stack real-time payment analytics dashboard built with **Next.js**, **NestJS**, and **WebSockets**.Real-time payment analytics dashboard built with Next.js, NestJS, MongoDB, and WebSockets.

- Redis (running locally)

- npm or yarn



### Installation### Prerequisites



#### 1. Install MongoDB on Windows- Node.js 18+ 



**Download and Install:**- Docker and Docker Compose## 🚀 Quick Start## Architecture

- Download MongoDB Community Server from: https://www.mongodb.com/try/download/community

- Run the installer (`.msi` file)- npm or yarn

- Choose "Complete" installation

- **Important**: Check "Install MongoDB as a Service" (it will auto-start)

- Keep default settings (Port: 27017)

### Installation

**Verify Installation:**

```powershell### Prerequisites- **Frontend**: Next.js 14 (App Router) + Redux Toolkit + RTK Query + MUI + Recharts

# Check if MongoDB service is running

Get-Service MongoDB```bash



# Or test connection# Install dependencies- Node.js 18+ - **Backend**: NestJS + WebSocket Gateway + MongoDB + Redis

mongo --version

```npm install



#### 2. Install Redis on Windows```- npm or yarn- **Infrastructure**: Docker Compose for local development



**Using Memurai (Redis for Windows):**

- Download Memurai from: https://www.memurai.com/get-memurai

- Install and run as Windows service### Setup Database- **Monorepo**: Nx workspace

- Default port: 6379



**OR Using WSL2:**

```powershell```bash### Installation

# If you have WSL2 installed

wsl# Start MongoDB and Redis with Docker

sudo apt-get update

sudo apt-get install redis-servernpm run docker:up## Quick Start

sudo service redis-server start

```



**Verify Installation:**# Seed database with 1000 sample payments```bash

```powershell

# Check if Redis is running (if using Memurai)npm run seed

Get-Service Memurai

```# Install dependencies### Prerequisites

# Or test connection

redis-cli ping

# Should return: PONG

```### Running the Applicationnpm install



#### 3. Install Project Dependencies



```bash**Start both servers:**```- Node.js 18+

npm install

```



### Setup Database```bash- Docker & Docker Compose



```bash# Terminal 1 - API Server (Port 3001)

# Seed database with 1000 sample payments

npm run seednpm run dev:api### Running the Application- npm or yarn

```



### Running the Application

# Terminal 2 - Web App (Port 3000)

**Start both servers:**

npm run dev:web

```bash

# Terminal 1 - API Server (Port 3001)```**Start both servers:**### Installation

npm run dev:api



# Terminal 2 - Web App (Port 3000)

npm run dev:webThen open **http://localhost:3000** in your browser.

```



Then open **http://localhost:3000** in your browser.

## 🎯 Features```bash```bash

## 🎯 Features



- **Real-time Updates**: WebSocket-powered live payment events from MongoDB

- **Interactive Dashboard**: Metrics cards, trend charts, and event feed- **Real-time Updates**: WebSocket-powered live payment events from MongoDB# Terminal 1 - API Server (Port 3001)# Install dependencies

- **Real Database**: MongoDB with actual data persistence and aggregations

- **Redis Caching**: Performance optimization with automatic cache invalidation- **Interactive Dashboard**: Metrics cards, trend charts, and event feed

- **Responsive Design**: Built with Material-UI for modern UI

- **State Management**: Redux Toolkit with RTK Query- **Real Database**: MongoDB with actual data persistence and aggregationsnpm run dev:apinpm install



## 📊 Tech Stack- **Redis Caching**: Performance optimization with automatic cache invalidation



### Frontend- **Responsive Design**: Built with Material-UI for modern UI

- **Next.js 14** - React framework with App Router

- **TypeScript** - Type-safe development- **State Management**: Redux Toolkit with RTK Query

- **Redux Toolkit** - State management

- **Material-UI** - Component library# Terminal 2 - Web App (Port 3000)# Start infrastructure (MongoDB, Redis)

- **Recharts** - Data visualization

- **Socket.IO Client** - WebSocket connection## 📊 Tech Stack



### Backendnpm run dev:webnpm run docker:up

- **NestJS** - Node.js framework

- **MongoDB** - NoSQL database with Mongoose ODM### Frontend

- **Redis** - Caching layer

- **Socket.IO** - WebSocket server- **Next.js 14** - React framework with App Router```

- **TypeScript** - Type-safe API

- **TypeScript** - Type-safe development

## 📁 Project Structure

- **Redux Toolkit** - State management# Seed database with sample data

```

payment_analytics/- **Material-UI** - Component library

├── apps/

│   ├── api/          # NestJS backend- **Recharts** - Data visualizationThen open **http://localhost:3000** in your browser.npm run seed

│   │   ├── src/

│   │   │   ├── app/- **Socket.IO Client** - WebSocket connection

│   │   │   │   ├── analytics/  # Analytics aggregations

│   │   │   │   ├── cache/      # Redis caching

│   │   │   │   └── payments/   # Payment CRUD & WebSocket

│   │   │   └── main.ts### Backend

│   │   └── seed/     # Database seeding script

│   └── web/          # Next.js frontend- **NestJS** - Node.js framework## 🎯 Features# Start development servers

├── libs/

│   ├── shared-types/ # Shared TypeScript types- **MongoDB** - NoSQL database with Mongoose ODM

│   └── utils/        # Shared utilities

└── package.json      # Root dependencies- **Redis** - Caching layernpm run dev

```

- **Socket.IO** - WebSocket server

## 💾 Database

- **TypeScript** - Type-safe API- **Real-time Updates**: WebSocket-powered live payment events```

The application uses MongoDB for data persistence with the following features:



- **Real-time data**: Payments created every 3 seconds via WebSocket

- **Aggregation pipelines**: Complex analytics queries optimized with indexes## 📁 Project Structure- **Interactive Dashboard**: Metrics cards, trend charts, and event feed

- **Redis caching**: 30-60 second TTL for frequently accessed data

- **Compound indexes**: Optimized for tenant + timestamp queries



### Payment Schema```- **Mock Data**: Runs without database - generates realistic demo dataThe application will be available at:

```typescript

{payment_analytics/

  tenantId: string,

  amount: number,├── apps/- **Responsive Design**: Built with Material-UI for modern UI- Frontend: http://localhost:3000

  currency: string,

  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'crypto',│   ├── api/          # NestJS backend

  status: 'pending' | 'completed' | 'failed' | 'refunded',

  merchantId: string,│   │   ├── src/- **State Management**: Redux Toolkit with RTK Query- Backend API: http://localhost:3001

  customerId: string,

  description: string,│   │   │   ├── app/

  createdAt: Date,

  updatedAt: Date│   │   │   │   ├── analytics/  # Analytics aggregations- WebSocket: ws://localhost:3001/ws/payments

}

```│   │   │   │   ├── cache/      # Redis caching



## 📝 Scripts│   │   │   │   └── payments/   # Payment CRUD & WebSocket## 📊 Tech Stack



```bash│   │   │   └── main.ts

npm run seed         # Seed database with 1000 payments

npm run dev:api      # Start API server│   │   └── seed/     # Database seeding script### Individual Services

npm run dev:web      # Start web app

npm run build        # Build all apps│   └── web/          # Next.js frontend

```

├── libs/### Frontend

## 🔌 API Endpoints

│   ├── shared-types/ # Shared TypeScript types

- `GET /api/analytics/metrics?tenantId=default` - Payment metrics (cached 30s)

- `GET /api/analytics/trends?tenantId=default&period=day` - Trend data (cached 60s)│   └── utils/        # Shared utilities- **Next.js 14** - React framework with App Router```bash

- `ws://localhost:3001/ws/payments` - Real-time payment events

├── docker-compose.yml # MongoDB & Redis containers

## 🛠️ Troubleshooting

└── package.json      # Root dependencies- **TypeScript** - Type-safe development# Start API only

### MongoDB not connecting?

```powershell```

# Check MongoDB service status

Get-Service MongoDB- **Redux Toolkit** - State managementnpm run dev:api



# Start MongoDB service if stopped## 💾 Database

Start-Service MongoDB

- **Material-UI** - Component library

# Check MongoDB logs

Get-Content "C:\Program Files\MongoDB\Server\7.0\log\mongod.log" -Tail 20The application uses MongoDB for data persistence with the following features:

```

- **Recharts** - Data visualization# Start web only

### Redis not connecting?

```powershell- **Real-time data**: Payments created every 3 seconds via WebSocket

# Check Memurai service status

Get-Service Memurai- **Aggregation pipelines**: Complex analytics queries optimized with indexes- **Socket.IO Client** - WebSocket connectionnpm run dev:web



# Start Memurai service if stopped- **Redis caching**: 30-60 second TTL for frequently accessed data

Start-Service Memurai

```- **Compound indexes**: Optimized for tenant + timestamp queries```



### Port already in use?

```powershell

# Check what's using port 3000 or 3001### Payment Schema### Backend

netstat -ano | findstr :3000

netstat -ano | findstr :3001```typescript



# Kill the process using the port{- **NestJS** - Node.js framework## Project Structure

taskkill /PID <PID> /F

```  tenantId: string,



## 📄 License  amount: number,- **TypeScript** - Type-safe API



MIT  currency: string,


  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'crypto',- **Socket.IO** - WebSocket server```

  status: 'pending' | 'completed' | 'failed' | 'refunded',

  merchantId: string,- **Mock Data Service** - Demo mode without databaseapps/

  customerId: string,

  description: string,  web/              # Next.js frontend

  createdAt: Date,

  updatedAt: Date## 📁 Project Structure  api/              # NestJS backend

}

```libs/



## 📝 Scripts```  shared-types/     # Shared TypeScript interfaces



```bashpayment_analytics/  ui/               # Shared UI components

npm run docker:up    # Start MongoDB & Redis

npm run docker:down  # Stop containers├── apps/  utils/            # Shared utilities

npm run docker:logs  # View container logs

npm run seed         # Seed database with 1000 payments│   ├── api/          # NestJS backendinfra/

npm run dev:api      # Start API server

npm run dev:web      # Start web app│   └── web/          # Next.js frontend  docker/           # Dockerfiles

npm run build        # Build all apps

```├── libs/  compose/          # docker-compose.yml



## 🔌 API Endpoints│   ├── shared-types/ # Shared TypeScript types```



- `GET /api/analytics/metrics?tenantId=default` - Payment metrics (cached 30s)│   └── utils/        # Shared utilities

- `GET /api/analytics/trends?tenantId=default&period=day` - Trend data (cached 60s)

- `ws://localhost:3001/ws/payments` - Real-time payment events└── package.json      # Root dependencies## Features



## 📄 License```



MIT### Real-Time Analytics


## 🎭 Demo Mode- Live payment event streaming via WebSocket

- Automatic reconnection with exponential backoff

The application runs in **demo mode** by default, generating mock payment data automatically:- Event filtering and buffering

- 100 pre-generated sample payments

- Real-time mock payment events every 3 seconds### Dashboard UI

- Realistic metrics and trend data- Metrics grid showing volume, success rate, average amount

- No database or Docker required- Interactive trend charts with day/week/month views

- Real-time events feed with color coding

## 📝 Scripts- Drill-down capabilities and CSV export



```bash### Performance Optimizations

npm run dev:api    # Start API server- Redis caching for hot endpoints

npm run dev:web    # Start web app- Virtualized lists for large datasets

npm run build      # Build all apps- Memoized chart data

```- Throttled WebSocket updates



## 📄 License### Multi-Tenant Support

- Tenant isolation via X-Tenant-Id header

MIT- Per-tenant analytics and metrics


## API Endpoints

### REST API
- `GET /api/analytics/metrics` - Current analytics metrics
- `GET /api/analytics/trends?period=day|week|month` - Trend data

### WebSocket
- `/ws/payments` - Real-time payment events

## Scripts

```bash
npm run dev          # Start all services
npm run build        # Build all projects
npm run lint         # Lint all projects
npm run test         # Run all tests
npm run type-check   # Type check all projects
npm run seed         # Seed database with sample data
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
npm run docker:logs  # View Docker logs
```

## Environment Variables

Create `.env` files in the respective app directories:

### apps/api/.env
```
MONGODB_URI=mongodb://localhost:27017/payment-analytics
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3001
```

### apps/web/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Development

The monorepo uses Nx for task orchestration and caching. Changes to shared libraries automatically trigger rebuilds of dependent apps.

## License

MIT
