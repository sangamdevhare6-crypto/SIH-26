# 🚀 KaushalSetu AI — Deployment Guide

## Architecture
- **Frontend** → [Vercel](https://vercel.com) (React + Vite)
- **Backend** → [Render](https://render.com) (Django + PostgreSQL)

---

## STEP 1: GitHub pe Code Upload Karo

Sabse pehle apna code GitHub pe push karo (agar nahi kiya to):

```bash
git init
git add .
git commit -m "Initial commit - KaushalSetu AI"
git remote add origin https://github.com/YOUR_USERNAME/sih-26.git
git push -u origin main
```

---

## STEP 2: Backend Deploy on Render

### 2.1 — Render Account Banao
1. [render.com](https://render.com) par jao → **Sign Up** (GitHub se login karo)

### 2.2 — PostgreSQL Database Banao
1. Dashboard mein **New +** → **PostgreSQL**
2. Name: `kaushalsetu-db`
3. Plan: **Free**
4. **Create Database** click karo
5. **Internal Database URL** copy kar lo → ye baad mein chahiye

### 2.3 — Web Service Banao (Django Backend)
1. **New +** → **Web Service**
2. Apna GitHub repo connect karo
3. Settings:
   - **Name**: `kaushalsetu-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan**: Free

4. **Environment Variables** add karo (Advanced section mein):

| Key | Value |
|-----|-------|
| `DJANGO_SECRET_KEY` | koi bhi random string (64+ characters) |
| `DEBUG` | `False` |
| `DATABASE_URL` | (Step 2.2 ka Internal Database URL paste karo) |
| `FRONTEND_URL` | (Step 3 ke baad Vercel URL yahan dalna) |

5. **Create Web Service** click karo
6. Deploy hone do (5-10 minutes lagenge)
7. Apna **Render Backend URL** note karo: `https://kaushalsetu-backend.onrender.com`

---

## STEP 3: Frontend Deploy on Vercel

### 3.1 — Vercel Account Banao
1. [vercel.com](https://vercel.com) par jao → **Sign Up** (GitHub se login karo)

### 3.2 — Project Import Karo
1. **Add New Project** → apna GitHub repo select karo
2. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite (auto-detect hoga)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables** add karo:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://kaushalsetu-backend.onrender.com/api` |

4. **Deploy** click karo
5. Tumhara frontend URL milega: `https://kaushalsetu-ai.vercel.app`

---

## STEP 4: CORS Update Karo (Last Step)

Vercel URL milne ke baad Render mein ek aur env variable update karo:

1. Render Dashboard → apna backend service → **Environment**
2. `FRONTEND_URL` ki value update karo:
   ```
   https://kaushalsetu-ai.vercel.app
   ```
3. Service automatically redeploy ho jayegi

---

## ✅ Deployment Complete!

| Service | URL |
|---------|-----|
| 🌐 Frontend | `https://kaushalsetu-ai.vercel.app` |
| ⚙️ Backend API | `https://kaushalsetu-backend.onrender.com/api` |
| 🔧 Django Admin | `https://kaushalsetu-backend.onrender.com/admin` |

> **Note:** Render free tier mein service 15 minute inactivity ke baad "sleep" ho jaati hai.
> Pehli request pe 30-60 seconds ka delay normal hai.
