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

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
