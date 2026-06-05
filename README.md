# Result Checker

A full-stack school result checker built with Flask and React/Vite. The system allows admins to register students, upload result CSV files, review class analytics, and allows students to securely view/download their own results.

## Tech Stack

- Backend: Flask, Flask-JWT-Extended, Flask-SQLAlchemy, Flask-Mail, pandas, ReportLab
- Frontend: React, Vite, React Router, Axios
- Database: SQLite for local development, configurable through `DATABASE_URI`

## Main Features

- Admin login and student login
- JWT-protected routes
- Admin student registration
- CSV result upload with validation
- Class analytics by subject
- Student-only result access protection
- PDF result generation
- Optional result email sending

## Project Structure

```text
backend/
  app.py
  config.py
  models/
  routes/
  utils/
frontend/
  src/
  package.json
```

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Update `backend/.env` with secure values:

```env
SECRET_KEY=your_long_random_secret
JWT_SECRET_KEY=your_different_long_random_secret
DATABASE_URI=sqlite:///result_checker.db
FRONTEND_URL=http://localhost:5173
MAIL_USERNAME=
MAIL_PASSWORD=
```

Initialize the database and seed the admin account:

```bash
python reset_db.py
python seed_admin.py
python app.py
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend env:

```env
VITE_API_URL=http://localhost:5000/api
```

## CSV Upload Format

The CSV file must contain these headers:

```csv
reg_no,subject,score,term,session
ABIC/2024/001,Mathematics,85,2nd Term,2023/2024
```

## Security Notes

- Do not commit `.env` or `.env.local` files.
- Rotate any secret that was previously committed.
- Students are only allowed to access their own result records.
- Admin routes require a JWT token with the admin role.
- CORS is restricted using `FRONTEND_URL`.

## Deployment Notes

For production, run Flask with a WSGI server such as Gunicorn instead of Flask debug mode.
