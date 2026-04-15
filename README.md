# </> DevBoard — Developer Blog Platform (MERN Stack)

A full-stack developer blogging platform where devs can write, publish, and explore technical articles.

## 🚀 Features

- **JWT Auth** — Register / Login / Protected routes
- **Full CRUD** — Create, Read, Update, Delete blog posts
- **Image Upload** — Cover images (local dev / Cloudinary in prod)
- **Like Posts** — Toggle likes, count shown on cards
- **Search & Filter** — Search by title/content, filter by tags
- **Pagination** — 9 posts per page
- **Developer Profile** — Bio, GitHub, Website, Skills, Avatar
- **Auto Read Time** — Calculated from word count
- **Auto Slug** — Generated from post title
- **Responsive UI** — Dark theme, works on all screens

## 🏗️ Tech Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| Frontend | React 18, React Router v6, Axios          |
| Backend  | Node.js, Express.js                       |
| Database | MongoDB Atlas + Mongoose                  |
| Auth     | JWT + bcryptjs                            |
| Upload   | Multer (dev) / Cloudinary (prod)          |

## ⚙️ Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas free account → [cloud.mongodb.com](https://cloud.mongodb.com)

### 1. Install dependencies

```bash
unzip devboard.zip && cd devboard
npm run install-all
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/devboard
JWT_SECRET=anylongrandomsecretstring
CLIENT_URL=http://localhost:3000
```

### 3. Start development servers

```bash
npm run dev
```

- **Frontend:** http://localhost:3000  
- **Backend:** http://localhost:5000  
- **API Health:** http://localhost:5000/api/health

---

## 📁 Project Structure

```
devboard/
├── server/
│   ├── controllers/       authController.js, postController.js, userController.js
│   ├── middleware/        auth.js (JWT), upload.js (Multer/Cloudinary)
│   ├── models/            User.js, Post.js
│   ├── routes/            auth.js, posts.js, users.js
│   ├── uploads/           local image storage (gitignored)
│   └── index.js
└── client/
    └── src/
        ├── components/    Navbar.js, PostCard.js
        ├── context/       AuthContext.js
        ├── pages/         Home, Login, Register, PostDetail, WritePost, Dashboard, Profile
        └── utils/         api.js (Axios instance)
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint          | Auth | Description        |
|--------|-------------------|------|--------------------|
| POST   | /api/auth/register | -   | Register user      |
| POST   | /api/auth/login    | -   | Login, get token   |
| GET    | /api/auth/me       | ✅  | Current user info  |

### Posts
| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| GET    | /api/posts            | -    | Get posts (search/filter)|
| GET    | /api/posts/tags       | -    | Get popular tags         |
| GET    | /api/posts/:slug      | -    | Get single post          |
| POST   | /api/posts            | ✅   | Create post              |
| PUT    | /api/posts/:id        | ✅   | Update your post         |
| DELETE | /api/posts/:id        | ✅   | Delete your post         |
| POST   | /api/posts/:id/like   | ✅   | Toggle like              |

### Users
| Method | Endpoint           | Auth | Description     |
|--------|--------------------|------|-----------------|
| GET    | /api/users/:id     | -    | Get user profile|
| PUT    | /api/users/profile | ✅   | Update profile  |

---

## 🐙 Push to GitHub

```bash
cd devboard
git init
git add .
git commit -m "feat: DevBoard MERN blog platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/devboard.git
git push -u origin main
```

---

## ☁️ Deploy (Free)

### Backend → Render.com

1. [render.com](https://render.com) → New Web Service → Connect GitHub
2. **Root Directory:** `server`
3. **Build:** `npm install` | **Start:** `npm start`
4. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (Vercel URL after step 2)
5. Copy the deployed URL (e.g. `https://devboard-api.onrender.com`)

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → New Project → Import GitHub
2. **Root Directory:** `client` | **Framework:** Create React App
3. Add env var: `REACT_APP_API_URL=https://devboard-api.onrender.com`
4. Update `client/src/utils/api.js`:
   ```js
   baseURL: process.env.REACT_APP_API_URL + '/api' || '/api'
   ```
5. Deploy → copy Vercel URL → paste into Render's `CLIENT_URL`

### Optional: Image Uploads via Cloudinary

1. Free account at [cloudinary.com](https://cloudinary.com)
2. Add to Render env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## 📝 What Recruiters Will See

- Clean MVC architecture (models / controllers / routes)
- JWT auth with protected routes (both FE + BE)
- Custom React Context + hooks
- File upload with multer + optional Cloudinary
- Search, filter, pagination
- Responsive dark UI

