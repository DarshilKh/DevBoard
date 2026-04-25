<div align="center">

# 🚀 DevBoard

### Developer Blog Platform — Built with MERN Stack

A full-stack blogging platform where developers can write,
publish, and explore technical articles.

[![Backend](https://img.shields.io/badge/API-Live-22c55e?style=for-the-badge&logo=render)](https://devboard-api.onrender.com/api/health)

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔐 JWT Auth | Register, Login, protected routes |
| 📝 Full CRUD | Create, Read, Update, Delete posts |
| 🖼️ Image Upload | Multer / Cloudinary |
| ❤️ Like Posts | Toggle likes |
| 🔍 Search & Filter | By title/content/tags |
| 📄 Pagination | 9 posts/page |
| 👤 Profile | Bio, GitHub, skills |
| ⏱️ Read Time | Auto calculated |
| 🔗 Slug | Auto-generated |
| 🌙 UI | Dark responsive |

---

## 🏗️ Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React 18, Router, Axios |
| Backend | Node.js, Express |
| DB | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Upload | Multer / Cloudinary |

---

## 📁 Structure

```
devboard/
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
└── client/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── utils/
```

---

## 🔌 API

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Posts
- GET `/api/posts`
- GET `/api/posts/:slug`
- POST `/api/posts`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id`
- POST `/api/posts/:id/like`

### Users
- GET `/api/users/:id`
- PUT `/api/users/profile`

---

## ⚙️ Run Locally

### 1. Install
```bash
git clone https://github.com/YOUR_USERNAME/devboard.git
cd devboard
npm run install-all
```

### 2. Env
```bash
cp server/.env.example server/.env
```

```
MONGODB_URI=your_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
```

### 3. Run
```bash
npm run dev
```

Frontend → http://localhost:3000  
Backend → http://localhost:5000  

---

## ☁️ Deploy

### Backend (Render)
- Root: `server`
- Build: `npm install`
- Start: `npm start`

### Frontend (Vercel)
- Root: `client`

---

## 📝 License
MIT

---

<div align="center">

Made with ❤️  
⭐ Star the repo

</div>
