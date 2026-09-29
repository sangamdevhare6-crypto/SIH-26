# SIH-26 — Frontend (React + Vite)

## 🚀 Project Kaise Start Karein

### Frontend Start Karein

```powershell
cd frontend
npm run dev
```

> Frontend `http://localhost:5173` par start hoga.

---

### Backend Start Karein (alag terminal mein)

```powershell
cd backend
pip install -r requirements.txt
python manage.py runserver
```

> Backend `http://localhost:8000` par start hoga.

---

> **Note:** Dono ko ek saath chalane ke liye **do alag terminals** kholen — ek frontend ke liye, ek backend ke liye.

---

## 📤 GitHub Push Commands (Sirf Commands - Copy & Paste)

### 1️⃣ Pehli Baar Code Push Karne Ke Liye (First Time Setup & Push)

> **Note:** Terminal ko main project folder (`SIH-26`) mein khol kar ye commands run karein:

```bash
git init
git add .
git commit -m "Initial commit - SIH-26"
git branch -M main
git remote add origin https://github.com/sangamdevhare6-crypto/SIH-26.git
git push -u origin main
```

> **Note:** Agar `remote origin already exists` error aaye, to pehle ye run karein:
> ```bash
> git remote set-url origin https://github.com/sangamdevhare6-crypto/SIH-26.git
> git push -u origin main
> ```

---

### 2️⃣ Aage Naya Code Push Karne Ke Liye (Daily / Updates)

```bash
git add .
git commit -m "Updated code"
git push
```

---

**GitHub Repository URL:** [https://github.com/sangamdevhare6-crypto/SIH-26](https://github.com/sangamdevhare6-crypto/SIH-26)
