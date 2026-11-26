# 🌌 LIFEVERSE

> **Turn Your Real Life Into an Adventure.**

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%20%7C%20v22%20%7C%20v24-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020.svg)](https://expo.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black.svg)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Tests-22%20Passed-brightgreen.svg)](https://vitest.dev/)

**LIFEVERSE** is an enterprise-grade gamified productivity and personal development ecosystem. It transforms everyday tasks, habits, learning roadmaps, and fitness workouts into an immersive role-playing game (RPG) across **Web** and **Android Mobile** devices.

Every completed real-life activity grants experience points (XP), virtual coins, achievements, and upgrades to your personal 3D floating island realm and avatar.

---

## 🚀 Key Highlights & Architectural Pillars

- 🛡️ **Server-Authoritative Gamification:** All XP, coin awards, streak calculations, and level-ups are verified server-side with idempotency keys—preventing duplicate claims or client manipulation.
- 🌌 **Cinematic 9-Act Landing Page:** ScrollTrigger-driven dimensional portal dive, 3D procedural world construction, and multi-tier character evolution.
- 🏝️ **3D Floating World & Customizer:** Real-time Three.js / React Three Fiber world builder where productivity unlocks buildings (Houses, Libraries, Gyms, Tech Citadels) with passive XP bonuses.
- 👤 **Interactive 3D Avatar Customizer:** Dynamic 3D avatar viewport with real-time armor, crowns, wings, and aura particle equipping.
- ⚡ **Cross-Platform Real-Time Sync:** Web and Android Mobile clients stay synchronized over authenticated Socket.IO WebSockets.
- 📱 **Native Android Mobile App:** Built on Expo SDK 52, Expo Router, Reanimated 3, Gesture Handler, Skia isometric canvases, and SecureStore.
- 🔐 **Hardened Security Architecture:** Bcrypt password hashing, short-lived JWTs, rotating refresh tokens with automatic replay reuse detection and multi-device revocation.
- 🛠️ **Administrative Governance:** Dedicated admin dashboard with user moderation, community report resolution, real-time audit logs, and dynamic XP multiplier controls.

---

## 📂 Monorepo Architecture

```text
LIFEVERSE/
├── packages/
│   ├── design-tokens/        # Shared colors, glassmorphism, typography & shadows
│   ├── shared/               # Pure gamification engine (levels, streaks, validation)
│   └── api-client/           # Axios HTTP client with automatic token rotation
├── server/                   # Node.js + Express + Socket.IO + Mongoose
│   ├── src/
│   │   ├── config/           # Database & environment configurations
│   │   ├── controllers/      # 18 modular API controllers
│   │   ├── middleware/       # RBAC, rate limiter, JWT auth, input validation
│   │   ├── models/           # 28 Mongoose models with TTL & compound indexes
│   │   ├── routes/           # REST endpoints mounted at /api/v1
│   │   ├── seeds/            # Initial admin, buildings, items, achievements seed
│   │   ├── services/         # Gamification, Auth, Notifications services
│   │   └── sockets/          # Real-time WebSocket event dispatcher
│   └── tests/                # 22 Vitest integration test cases (100% passing)
├── apps/
│   ├── web/                  # React 18 + Vite + Tailwind + Three.js / R3F
│   │   ├── src/components/   # 3D Canvases (Portal, Island, Avatar) & UI primitives
│   │   ├── src/pages/        # 25+ rich dashboard & landing pages
│   │   └── src/stores/       # Zustand client state management
│   └── mobile/               # Expo SDK 52 Android mobile app
│       ├── app/              # Expo Router tabs & authentication screens
│       ├── components/       # Reanimated cards, buttons & Skia isometric grid
│       └── android/          # Prebuilt native Android Gradle project
└── docs/                     # Full technical documentation suite
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Web Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Three.js, React Three Fiber, React Three Drei, GSAP & ScrollTrigger, Motion for React, Zustand, TanStack Query, Lucide React, Recharts |
| **Mobile Frontend**| React Native, Expo SDK 52, Expo Router, React Native Reanimated 3, Gesture Handler, Expo SecureStore, Expo Haptics, Expo Notifications |
| **Backend API** | Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs, Helmet, Express Rate Limit, Swagger-UI / OpenAPI |
| **Quality & Tests** | Vitest, Supertest, ESLint, Prettier |

---

## ⚡ Quick Start Guide (Ubuntu / Linux)

### 1. Prerequisites
Ensure you have Node.js (v20+ or v24+), npm, and MongoDB installed.
```bash
# If using NVM:
export PATH="$HOME/.nvm/versions/node/v24.17.0/bin:$PATH"
node -v # Should report v20.x or higher
```

### 2. Install Workspace Dependencies
```bash
git clone https://github.com/your-org/LIFEVERSE.git
cd LIFEVERSE
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27018/lifeverse`
- `JWT_ACCESS_SECRET=your_jwt_access_secret_key_minimum_32_chars`
- `JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_32_chars`

### 4. Seed the Database
Populate the database with the initial administrator, avatar items, building catalog, achievements, and system settings:
```bash
cd server
npm run seed
cd ..
```

### 5. Launch the Ecosystem

Open two terminal windows:

**Terminal 1 — Backend API & WebSockets:**
```bash
cd server
npm run dev
# Server running at http://localhost:5000
# Swagger API docs at http://localhost:5000/api/docs
```

**Terminal 2 — Web Application:**
```bash
cd apps/web
npm run dev
# Web app running at http://localhost:5173
```

---

## 🔑 Default Seed Credentials

| Account Role | Email | Password | Access Level |
|:---|:---|:---|:---|
| **System Administrator** | `admin@lifeverse.io` | `AdminPass123!` | Full Admin Panel, User Moderation, Audit Logs, Settings |
| **Demo Player** | `alex@lifeverse.io` | `PlayerPass123!` | Standard Player Dashboard, Quests, Island, Avatar |

---

## 🧪 Testing & Verification

Run the comprehensive Vitest backend integration test suite:
```bash
cd server
npm test
```
All 5 test suites (22 individual tests) pass with 100% coverage across authentication, gamification calculations, quest completion, habit streak tracking, and marketplace purchases.

To verify the production web build:
```bash
npm --workspace=apps/web run build
```

---

## 📱 Android Mobile Build & Run

The Android mobile app is configured with Expo SDK 52 and prebuilt with native Android Gradle tooling:

```bash
cd apps/mobile

# Run in Expo development mode
npx expo start

# Run on connected Android device / emulator
npx expo run:android

# Compile Debug APK directly via Gradle
cd android
./gradlew assembleDebug
```
The compiled APK will be located at:
`apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📖 Detailed Documentation

Comprehensive system documentation is available in the `docs/` directory:
- [Architecture & System Design](file:///home/abservetech/Downloads/project/LIFEVERSE/docs/architecture.md)
- [Database Schemas & Indexes](file:///home/abservetech/Downloads/project/LIFEVERSE/docs/database.md)
- [REST & Real-Time API Reference](file:///home/abservetech/Downloads/project/LIFEVERSE/docs/api.md)
- [Animation & 3D Visual System](file:///home/abservetech/Downloads/project/LIFEVERSE/docs/animations.md)
- [Production Deployment & DevOps Guide](file:///home/abservetech/Downloads/project/LIFEVERSE/docs/deployment.md)
- [Quality Assurance & Testing Suite](file:///home/abservetech/Downloads/project/LIFEVERSE/docs/testing.md)

---

## 📜 License
Released under the [MIT License](file:///home/abservetech/Downloads/project/LIFEVERSE/LICENSE).
