# SIH-26 — Backend (Django)

## 🚀 Project Kaise Start Karein

### Backend Start Karein

```powershell
cd backend
pip install -r requirements.txt
python manage.py runserver
```

> Backend `http://localhost:8000` par start hoga.

---

### Frontend Start Karein (alag terminal mein)

```powershell
cd frontend
npm run dev
```

> Frontend `http://localhost:5173` par start hoga.

---

> **Note:** Dono ko ek saath chalane ke liye **do alag terminals** kholen — ek frontend ke liye, ek backend ke liye.

---

## 📁 Backend Structure

```
backend/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── config/          # Django settings & URLs
├── users/           # User management
├── learners/        # Learner module
├── employers/       # Employer module
├── institutes/      # Institute module
├── courses/         # Courses module
├── jobs/            # Jobs module
├── skills/          # Skills module
├── assessments/     # Assessments module
├── applications/    # Job applications
├── analytics/       # Analytics module
├── notifications/   # Notifications
├── reports/         # Reports module
├── ml_engine/       # ML Engine
└── skill_gap/       # Skill gap analysis
```

## ⚙️ Database Migrations (agar zaroori ho)

```powershell
python manage.py makemigrations
python manage.py migrate
```

## 👤 Admin User Banayein

```powershell
python manage.py createsuperuser
```

> Admin panel: `http://localhost:8000/admin`
