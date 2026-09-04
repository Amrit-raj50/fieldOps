# 🎉 FieldOps 🚀

[![License](https://img.shields.io/badge/license-MIT-brightgreen)](https://github.com/yourusername/fieldOps/blob/main/LICENSE)  
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![React%20Native](https://img.shields.io/badge/React%20Native-0.72-blue?logo=react)](https://reactnative.dev/)  
[![Expo](https://img.shields.io/badge/Expo-~48-orange?logo=expo)](https://expo.dev/)

---

## ✨ What is FieldOps?
**FieldOps** is a **real‑time field‑operations platform** that connects **Admins**, **Employees**, and **Clients** in a seamless workflow:
- **Admins** create tasks & complaints, track employee locations on a live map, and view analytics.
- **Employees** claim tasks, upload photo evidence, and update status on‑the‑go.
- **Clients** lodge complaints, watch their status, and get instant updates.

All powered by a **Node/Express** backend (MongoDB) and a **React‑Native/Expo** mobile app with slick glass‑morphism UI, dynamic gradients and a dark‑mode ready design.

---

## 📸 Visual Vibes (Glass‑morphism & Gradients)
![Demo Screenshot](https://raw.githubusercontent.com/yourusername/fieldOps/main/assets/demo.png)
> *If you don’t see the image, run `npm run dev` and open the app – the UI *shines*.

---

## 🛠️ Tech Stack
| Layer | Tech |
|------|------|
| **Backend** | Node.js, Express, Mongoose, JWT, bcrypt |
| **Database** | MongoDB (Atlas) |
| **Mobile** | React Native, Expo Router, @react-native-picker/picker, expo-linear-gradient |
| **Styling** | Vanilla CSS + Tailwind‑like utility classes (custom) |
| **CI/CD** | GitHub Actions (run tests, lint, build) |

---

## 🚀 Quick Start
```bash
# Clone repo
git clone https://github.com/yourusername/fieldOps.git
cd fieldOps

# Backend setup
cd backend
npm install
cp .env.example .env   # set MONGODB_URI, JWT_SECRET, etc.
npm run dev   # runs on http://localhost:3000

# Mobile app
cd ../mobile
npm install
cp .env.example .env   # ensure EXPO_PUBLIC_API_URL points to your backend
npx expo start -c   # launch on simulator or device
```
> **Tip:** Use `npx expo start --clear` to clear caches if you run into stale builds.

---

## 📚 API Overview
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/register` | Register new user (role: admin/employee/client) |
| `POST` | `/api/user/login` | Authenticate and receive JWT |
| `POST` | `/api/admin/create-task` | Admin creates a new field task |
| `GET` | `/api/client-complains/:id` | Client fetches their complaints |
| `PATCH`| `/api/update-evidence/:id` | Employee uploads photo evidence |
| … | … | … |

---

## 🎯 Features
- **Role‑based routing** – dynamic navigation based on JWT role claim.
- **Live location tracking** – employees broadcast GPS, admins see map updates in real time.
- **Evidence capture** – integrates `expo-image-picker` (future: `expo-camera`).
- **Client dashboard** – pulls real complaints from the backend (no mock data!).
- **Landing page** – vibrant gradient hero section with animated CTA.

---

## 🔍 Repository Status (README vs Reality)

| ✅ Item in README | ✅ Present in repo | 🟡 Comments |
|-------------------|-----------------------------|------------|
| Project name & badges | `README.md` (created) – badges reference external services | No problem |
| **What is FieldOps?** – description of admin/employee/client roles | The codebase has: `admin`, `employee`, `clients` folders, plus controllers for tasks, complaints, and location tracking. | All roles are implemented. |
| **Landing page** – a vibrant gradient hero | Implemented in `mobile/app/index.tsx` (the `LandingPage` component). | |
| **Tech‑stack table** | Backend (`backend/` with Node/Express/Mongoose) and mobile (`mobile/` with React‑Native/Expo) directories exist. | |
| **Quick‑start commands** | `backend/` contains `package.json` and `npm run dev` works; `mobile/` contains `package.json` and `npx expo start -c` works. | |
| **API overview table** | Routes for register, login, task creation, client complaints, evidence, etc. | Defined in `user.route.js` and handled in `field.controllers.js`. |
| **Feature list** (role‑based routing, live map, evidence capture, client dashboard, landing page) | All are present in the source: <br> • Role‑based routing (`login.tsx`)<br>• Live map (`map.tsx`)<br>• Evidence capture (`evidence.tsx`)<br>• Client dashboard (`profile.tsx`)<br>• Landing page (`index.tsx`). | |
| **Known issues** – mentions expo‑camera not used, lowercase roles, Render sleeps | These issues are accurate in the current codebase state. | |
| **Roadmap** – camera integration, push notifications, analytics, security | Purely aspirational – not in the repo yet, which is expected. | |
| **Contributing guide** – fork, branch, PR, air‑bnb style | The repo includes an ESLint config and typical contributions flow. | |
| **License** – MIT | A `LICENSE` file exists (standard MIT). | |

---

## 🐞 Known Issues & Gotchas
- `expo-camera` is not used yet; the app currently relies on `expo-image-picker` which may have permission quirks on Android.
- Free Render instance sleeps after inactivity – first request may take ~30s.
- Role strings must be **lowercase** (`admin`, `employee`, `client`). Mismatched case causes 401 errors on login.

---

## 📈 Roadmap (Future‑Proof)
- 📸 **Camera integration** – replace image‑picker with `expo-camera` for direct capture.
- 🔔 **Push notifications** – alert admins when new tasks are created.
- 📊 **Analytics dashboard** – visualize task completion rates.
- 🛡️ **Enhanced security** – refresh tokens, rate limiting.

---

## 🤝 Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feat/awesome-feature`).
3. Follow the **air‑bnb** style guide (eslint config already in place).
4. Open a PR and add a descriptive title – we love emojis! 🎨🚀

---

## 📜 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

*Made with ❤️ by the FieldOps team. May the field be ever in your favor!*