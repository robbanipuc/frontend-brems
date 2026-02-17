# BREMS - Bangladesh Railway Employee Management System

**Complete Documentation** | Features • User Manual • Schema • API • Development • Deployment

---

## Table of Contents

1. [Overview](#1-overview)
2. [Features](#2-features)
3. [User Manual](#3-user-manual)
4. [Database Schema](#4-database-schema)
5. [ER Diagram](#5-er-diagram)
6. [API Endpoints](#6-api-endpoints)
7. [Clone & Run Locally](#7-clone--run-locally)
8. [Project Structure & Enhancement Guide](#8-project-structure--enhancement-guide)
9. [Deployment Tutorials](#9-deployment-tutorials)

---

## 1. Overview

**BREMS** is a full-stack web application for managing employee records, offices, designations, transfers, promotions, profile requests, and forms for Bangladesh Railway. It supports both **English** and **বাংলা (Bangla)** languages.

| Component | Tech Stack |
|-----------|------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Laravel 11, PHP 8.4 |
| Database | MySQL / MariaDB / SQLite / TiDB (MySQL-compatible) |
| Auth | Laravel Sanctum (Bearer tokens) |

**Repositories:**
- Backend: [https://github.com/hasan-nazmul/brems-backend](https://github.com/hasan-nazmul/brems-backend)
- Frontend: [https://github.com/hasan-nazmul/brems-frontend](https://github.com/hasan-nazmul/brems-frontend)

---

## 2. Features

### 2.1 Authentication & Roles
- **Login / Logout** – Email + password authentication
- **Three roles:**
  - **Super Admin** – Full access (offices, designations, users, forms, reports, promotions, retirements)
  - **Office Admin** – Manage employees & offices they are assigned to
  - **Verified User** – View own profile, submit forms, submit profile requests
- **Change Password** – Users can update their password
- **Language Switcher** – Toggle between English and Bangla (saved in localStorage)

### 2.2 Dashboard
- Welcome message and stats (total employees, active, unverified, pending requests, offices, designations, released, retired)
- **Employees by Office** – Bar chart (top 10 offices)
- **Quick Actions** – Add Employee, Add Office, Create Form, Transfer, View Reports, Profile Requests
- **Recent Activity** – Transfers, promotions, approved/rejected requests
- **Pending Items** – Profile requests and unverified employees

### 2.3 Employees
- **List** – Search, filter by office, status, verification; pagination; export CSV/PDF
- **Create** – Basic info, personal details, employment (office, designation, cadre, joining date)
- **View** – Profile with tabs: Personal Info, Employment, Family, Address, Academics, Documents, Timeline, Punishments, Account
- **Edit** – Update all sections; upload photo, NID, birth certificate, academic certificates
- **Transfer** – Move employee to another office with order number and attachment
- **Promote** – Change designation with order and attachment
- **Release** – Release from service (status: released)
- **Retire** – Mark as retired (Super Admin only)
- **Profile PDF** – Download employee profile as PDF
- **Released Employees** – View and manage released employees

### 2.4 Offices
- **List** – Tree view; search; filter by zone
- **Create / Edit** – Name, code, zone, location, parent office
- **View** – Office info, employees, child offices; **Export PDF/CSV** (office details + employees + vacant posts)
- **Sanctioned Strength** – Set total posts per designation per office; **Edit office & posts**
- **Vacant Posts Report** – Per-office report; **Export PDF/CSV**

### 2.5 Designations
- **List** – Search; create/edit/delete designations
- **Fields** – Title, Title (Bangla), Grade, salary range, recruitment info
- **Office-specific** – Designations can be global or tied to an office

### 2.6 Users
- **List** – All users; search; create, edit, deactivate, reset password
- **Assign Office Admin** – Link user to office(s) for office_admin role

### 2.7 Profile Requests
- **Submit** – Employees submit requests (e.g. personal info update, address change)
- **My Requests** – View own requests
- **Admin** – List, approve/reject, add notes; **Download Report** (PDF)

### 2.8 Forms
- **List** – Active forms; **My Submissions**
- **Form Builder** – Create forms with fields (text, number, date, select, file, textarea)
- **Fill Form** – Submit data; view submission status
- **Submissions** – Admin views all submissions; approve/reject

### 2.9 Reports
- **Employee Statistics** – PDF export
- **Transfer Report** – By date range; PDF export
- **Promotion Report** – By date range; PDF export
- **Office Report** – Office directory; PDF export
- **Profile Requests Report** – PDF export
- **Vacant Posts (Sanctioned Strength)** – Per-office; **Export PDF/CSV**
- **Office Export** – Per office: details, employees, total posts, vacancies; **Export PDF/CSV**

### 2.10 Punishments
- **Types** – Dismissal, removal, reduction, compulsory retirement, censure, withholding increment/promotion, recovery
- **Add / Edit** – Order date, type, comment, attachment

### 2.11 Files & Storage
- Profile pictures, NID, birth certificate, academic certificates, child birth certificates
- **Cloudinary** – Optional cloud storage for file uploads

---

## 3. User Manual

### 3.1 Login
1. Go to the login page.
2. Enter **Email** and **Password**.
3. Optionally use **English** or **বাংলা** language switcher.
4. Click **Sign in**.

**Demo Credentials:**
- Super Admin: `admin@railway.gov.bd` / `password`
- Office Admin: `office@railway.gov.bd` / `password`

### 3.2 Dashboard
- Stats cards link to filtered lists (e.g. Unverified → employees with `is_verified=false`).
- Quick Actions open create/edit pages or reports.
- Pending Items link to profile requests and unverified employees.

### 3.3 Add Employee
1. **Employees** → **Add Employee**.
2. Fill **Basic Information** (first name, last name, name in Bangla, NID, phone, DOB).
3. Fill **Personal Details** (gender, religion, blood group, marital status, etc.).
4. Fill **Employment Information** (office, designation, cadre, batch, joining date).
5. Click **Create Employee**.

### 3.4 Vacant Posts Report
1. **Reports** → **Vacant Posts**.
2. Select an office.
3. View table (designation, total post, posted, vacant).
4. Use **Export PDF** or **Export CSV** to download.

### 3.5 Office Export
1. **Offices** → click an office.
2. In the header, click **Export PDF** or **Export CSV**.
3. File includes office details, employees, and posts/vacancies.

### 3.6 Language
- Click **English** or **বাংলা** in the header or login page.
- Choice is saved; all UI text switches accordingly.

---

## 4. Database Schema

### 4.1 Tables Overview

| Table | Purpose |
|-------|---------|
| `offices` | Office hierarchy (parent_id); name, code, zone, location |
| `designations` | Job titles; title, title_bn, grade, basic_salary; optional office_id |
| `employees` | Core employee data; links to designation, current_office |
| `users` | Auth; links to employee (optional), office; role, is_active |
| `family_members` | Father, mother, spouse, children per employee |
| `addresses` | Present/permanent address per employee |
| `academic_records` | Education records per employee |
| `transfer_histories` | Transfer events (from_office, to_office, order) |
| `promotion_histories` | Promotion events (new_designation, order) |
| `punishments` | Punishment records (type, order_date, attachment) |
| `profile_requests` | Employee requests for profile changes |
| `forms` | Dynamic form definitions |
| `form_fields` | Fields per form (label, type, options, required) |
| `form_submissions` | Submitted form data (employee_id, form_id, data, status) |
| `office_designation_posts` | Sanctioned strength (office_id, designation_id, total_posts) |
| `personal_access_tokens` | Laravel Sanctum tokens |

### 4.2 Key Columns (Summary)

**offices:** id, parent_id, name, zone, code, location, timestamps  
**designations:** id, office_id (nullable), title, title_bn, grade, basic_salary, timestamps  
**employees:** id, designation_id, current_office_id, first_name, last_name, name_bn, nid_number, phone, dob, gender, religion, blood_group, marital_status, status (active/released/retired), is_verified, joining_date, timestamps, soft deletes  
**users:** id, employee_id, office_id, name, email, password, role, is_active, timestamps, soft deletes  
**profile_requests:** id, employee_id, request_type, details, proposed_changes, status, is_approved, admin_note, reviewed_by, reviewed_at  
**office_designation_posts:** id, office_id, designation_id, total_posts (unique on office_id+designation_id)

---

## 5. ER Diagram

```mermaid
erDiagram
    offices ||--o{ offices : "parent_id"
    offices ||--o{ employees : "current_office_id"
    offices ||--o{ office_designation_posts : "office_id"
    offices ||--o{ users : "office_id"
    
    designations ||--o{ employees : "designation_id"
    designations ||--o{ office_designation_posts : "designation_id"
    designations ||--o{ promotion_histories : "new_designation_id"
    offices ||--o{ designations : "office_id"
    
    employees ||--o{ users : "employee_id"
    employees ||--o{ family_members : "employee_id"
    employees ||--o{ addresses : "employee_id"
    employees ||--o{ academic_records : "employee_id"
    employees ||--o{ transfer_histories : "employee_id"
    employees ||--o{ promotion_histories : "employee_id"
    employees ||--o{ punishments : "employee_id"
    employees ||--o{ profile_requests : "employee_id"
    employees ||--o{ form_submissions : "employee_id"
    
    users ||--o{ profile_requests : "reviewed_by"
    users ||--o{ transfer_histories : "created_by"
    users ||--o{ promotion_histories : "created_by"
    users ||--o{ forms : "created_by"
    
    forms ||--o{ form_fields : "form_id"
    forms ||--o{ form_submissions : "form_id"
    
    offices {
        bigint id PK
        bigint parent_id FK
        string name
        string zone
        string code
        string location
    }
    
    designations {
        bigint id PK
        bigint office_id FK
        string title
        string title_bn
        string grade
        decimal basic_salary
    }
    
    employees {
        bigint id PK
        bigint designation_id FK
        bigint current_office_id FK
        string first_name
        string last_name
        string name_bn
        string nid_number
        enum status
        boolean is_verified
        date joining_date
    }
    
    users {
        bigint id PK
        bigint employee_id FK
        bigint office_id FK
        string name
        string email
        string password
        enum role
        boolean is_active
    }
    
    profile_requests {
        bigint id PK
        bigint employee_id FK
        bigint reviewed_by FK
        string request_type
        enum status
        boolean is_approved
    }
    
    forms {
        bigint id PK
        bigint created_by FK
        string title
        boolean is_active
    }
    
    office_designation_posts {
        bigint id PK
        bigint office_id FK
        bigint designation_id FK
        int total_posts
    }
```

---

## 6. API Endpoints

**Base URL:** `{BACKEND_URL}/api`  
**Auth:** `Authorization: Bearer {token}`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login (email, password) |
| POST | `/logout` | Logout |
| GET | `/user` | Current user |
| POST | `/change-password` | Change password |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard stats & data |

### Offices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/offices` | List offices |
| GET | `/offices/tree` | Office tree |
| GET | `/offices/managed` | Managed offices |
| GET | `/offices/{id}` | Office detail |
| GET | `/offices/{id}/vacant-posts` | Vacant posts report |
| GET | `/offices/{id}/vacant-posts/export-pdf` | Export vacant posts PDF |
| GET | `/offices/{id}/vacant-posts/export-csv` | Export vacant posts CSV |
| GET | `/offices/{id}/export-pdf` | Export office full report PDF |
| GET | `/offices/{id}/export-csv` | Export office full report CSV |
| PUT | `/offices/{id}/designation-posts` | Update sanctioned posts |
| POST | `/offices` | Create office (super_admin) |
| PUT | `/offices/{id}` | Update office |
| DELETE | `/offices/{id}` | Delete office |

### Designations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/designations` | List designations |
| GET | `/designations/{id}` | Designation detail |
| POST | `/designations` | Create (super_admin) |
| PUT | `/designations/{id}` | Update |
| DELETE | `/designations/{id}` | Delete |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List (filters, pagination) |
| GET | `/employees/released` | Released employees |
| GET | `/employees/export-csv` | Export CSV |
| GET | `/employees/export-pdf` | Export PDF |
| GET | `/employees/{id}` | Employee detail |
| GET | `/employees/{id}/download-pdf` | Profile PDF |
| POST | `/employees` | Create |
| PUT | `/employees/{id}` | Update |
| POST | `/employees/{id}/update-full` | Full profile update |
| PUT | `/employees/{id}/verify` | Verify |
| POST | `/employees/{id}/release` | Release |
| POST | `/employees/{id}/transfer` | Transfer |
| POST | `/employees/{id}/promote` | Promote (super_admin) |
| POST | `/employees/{id}/retire` | Retire (super_admin) |
| DELETE | `/employees/{id}` | Delete (super_admin) |

### Profile Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile-requests/my` | My requests |
| GET | `/profile-requests` | All (admin) |
| GET | `/profile-requests/{id}` | Detail |
| GET | `/profile-requests/{id}/report` | Download PDF |
| POST | `/profile-requests` | Submit |
| PUT | `/profile-requests/{id}` | Update (approve/reject) |

### Forms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms` | List forms |
| GET | `/forms/{id}` | Form detail |
| POST | `/forms/{id}/submit` | Submit form |
| GET | `/my-submissions` | My submissions |
| GET | `/form-submissions` | All submissions (admin) |
| POST | `/forms` | Create form (super_admin) |
| PUT | `/forms/{id}` | Update form |
| DELETE | `/forms/{id}` | Delete form |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/employee-statistics` | Employee stats |
| GET | `/reports/employee-statistics/pdf` | Stats PDF |
| GET | `/reports/transfers` | Transfer report |
| GET | `/reports/transfers/pdf` | Transfer PDF |
| GET | `/reports/promotions` | Promotion report |
| GET | `/reports/promotions/pdf` | Promotion PDF |
| GET | `/reports/offices` | Office report |
| GET | `/reports/offices/pdf` | Office PDF |
| GET | `/reports/profile-requests` | Profile requests report |
| GET | `/reports/profile-requests/pdf` | Profile requests PDF |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/employees/{id}/photo` | Upload profile photo |
| POST | `/employees/{id}/documents/nid` | Upload NID |
| POST | `/employees/{id}/documents/birth` | Upload birth cert |
| POST | `/employees/{id}/academics/{academicId}/certificate` | Upload academic cert |

---

## 7. Clone & Run Locally

### 7.1 Prerequisites
- **PHP 8.4+** (Composer)
- **Node.js 18+** (npm or pnpm)
- **MySQL 8+** (or MariaDB / SQLite / TiDB Cloud)
- **Git**

### 7.2 Clone Repositories

```bash
# Clone backend
git clone https://github.com/hasan-nazmul/brems-backend.git
cd brems-backend

# Clone frontend (in another folder)
git clone https://github.com/hasan-nazmul/brems-frontend.git
cd brems-frontend
```

### 7.3 Backend Setup

```bash
cd brems-backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database in .env
# For MySQL:
#   DB_CONNECTION=mysql
#   DB_HOST=127.0.0.1
#   DB_PORT=3306
#   DB_DATABASE=brems
#   DB_USERNAME=root
#   DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed (optional - creates demo data)
php artisan db:seed

# Start Laravel
php artisan serve
# Backend: http://localhost:8000
# API: http://localhost:8000/api
```

### 7.4 Frontend Setup

```bash
cd brems-frontend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Set API URL in .env
# VITE_API_URL=http://localhost:8000/api

# Start dev server
npm run dev
# Frontend: http://localhost:5173
```

### 7.5 Quick Test
1. Open http://localhost:5173
2. Login with `admin@railway.gov.bd` / `password` (if seeded)
3. Check dashboard, employees, offices, reports

---

## 8. Project Structure & Enhancement Guide

### 8.1 Backend (Laravel)

#### Directory Structure
```
brems-backend/
├── app/
│   ├── Http/Controllers/   # API controllers
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── EmployeeController.php
│   │   ├── OfficeController.php
│   │   ├── DesignationController.php
│   │   ├── UserController.php
│   │   ├── ProfileRequestController.php
│   │   ├── FormController.php
│   │   ├── ReportController.php
│   │   ├── HistoryController.php
│   │   ├── FileController.php
│   │   └── PunishmentController.php
│   └── Models/             # Eloquent models
│       ├── User.php
│       ├── Employee.php
│       ├── Office.php
│       ├── Designation.php
│       ├── ProfileRequest.php
│       ├── Form.php, FormField.php, FormSubmission.php
│       ├── TransferHistory.php, PromotionHistory.php
│       ├── Punishment.php
│       └── ...
├── database/
│   └── migrations/         # Schema changes (run: php artisan migrate)
├── routes/
│   └── api.php             # All API routes
├── resources/views/reports/  # PDF Blade templates
└── .env                    # Config (DB, CLOUDINARY_URL, etc.)
```

#### Adding a New Migration
```bash
php artisan make:migration create_something_table
# Edit database/migrations/xxxx_create_something_table.php
php artisan migrate
```

#### Adding a New Controller
```bash
php artisan make:controller SomethingController
# Add logic in app/Http/Controllers/SomethingController.php
# Register routes in routes/api.php
```

#### Adding a New Model
```bash
php artisan make:model Something -m   # -m creates migration
# Define fillable, relationships in app/Models/Something.php
```

### 8.2 Frontend (React)

#### Directory Structure
```
brems-frontend/src/
├── components/
│   ├── common/          # Reusable: Button, Input, Card, Modal, Table, etc.
│   ├── dashboard/       # StatsGrid, QuickActions, OfficeStatsChart, etc.
│   └── layout/          # Header, Sidebar, MainLayout, AuthLayout, Logo
├── context/
│   ├── AuthContext.jsx      # User, login, logout
│   └── LanguageContext.jsx  # locale, t(), setLocale
├── hooks/               # usePermissions, etc.
├── pages/               # Route components
│   ├── auth/Login.jsx
│   ├── dashboard/Dashboard.jsx
│   ├── employees/       # EmployeeList, EmployeeDetail, EmployeeCreate, EmployeeEdit
│   ├── offices/
│   ├── designations/
│   ├── users/
│   ├── profile-requests/
│   ├── forms/
│   ├── reports/
│   ├── profile/
│   └── settings/
├── routes/
│   ├── AppRoutes.jsx    # Route definitions
│   ├── ProtectedRoute.jsx
│   ├── RoleRoute.jsx
│   └── GuestRoute.jsx
├── services/            # API calls
│   ├── api.js           # Axios instance, apiDownload
│   ├── authService.js
│   ├── employeeService.js
│   ├── officeService.js
│   ├── reportService.js
│   └── ...
├── translations/
│   ├── en.js
│   └── bn.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── api.js
├── App.jsx
└── main.jsx
```

#### Frontend Flow (Simplified)
1. **main.jsx** – Renders `LanguageProvider` → `AuthProvider` → `App` with `BrowserRouter`
2. **App.jsx** – Renders `AppRoutes`
3. **AppRoutes** – Defines routes; uses `GuestRoute` (login) and `ProtectedRoute` (main app)
4. **ProtectedRoute** – Checks auth; redirects to `/login` if not logged in
5. **RoleRoute** – Checks role; redirects if unauthorized
6. **MainLayout** – Sidebar + Header + Outlet; used for all protected pages
7. **Pages** – Fetch data via services (e.g. `employeeService.getById(id)`); display UI
8. **AuthContext** – Stores `user`, `login`, `logout`; persists token in localStorage

#### Adding a New Page
1. Create `src/pages/feature/FeaturePage.jsx`
2. Add route in `AppRoutes.jsx`
3. Add nav item in `Sidebar.jsx` (if needed)
4. Create `featureService.js` in `services/` if you need new API calls

#### Adding Translations
- Add keys in `src/translations/en.js` and `src/translations/bn.js`
- Use `const { t } = useLanguage(); t('section.key')` in components

---

## 9. Deployment Tutorials

### 9.1 Render – Backend (Laravel)

1. **Create Render Account**  
   Go to [render.com](https://render.com) and sign up.

2. **Create MySQL Database**  
   - Dashboard → New → PostgreSQL (or use external MySQL/TiDB)  
   - For MySQL, use **TiDB Cloud** or **PlanetScale** as external DB and note connection details.

3. **Create Web Service**  
   - New → Web Service  
   - Connect your GitHub repo: `hasan-nazmul/brems-backend`  
   - **Build Command:**
     ```bash
     composer install --optimize-autoloader --no-dev
     php artisan key:generate
     php artisan migrate --force
     php artisan config:cache
     ```
   - **Start Command:**
     ```bash
     php -S 0.0.0.0:$PORT -t public
     ```
   - **Environment Variables:**
     - `APP_ENV=production`
     - `APP_DEBUG=false`
     - `APP_KEY` (generate: `php artisan key:generate --show`)
     - `APP_URL` = your Render service URL (e.g. `https://brems-api.onrender.com`)
     - `DB_CONNECTION=mysql`
     - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (from TiDB/PlanetScale/other)
     - `CLOUDINARY_URL` (optional)

4. **Deploy**  
   Render will build and deploy. Note the URL (e.g. `https://brems-api.onrender.com`).

---

### 9.2 Netlify – Frontend (React)

1. **Create Netlify Account**  
   Go to [netlify.com](https://netlify.com) and sign up.

2. **Connect Repository**  
   - Add new site → Import from Git  
   - Connect `hasan-nazmul/brems-frontend`

3. **Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:**
     - `VITE_API_URL` = your backend API URL (e.g. `https://brems-api.onrender.com/api`)

4. **Redirects (SPA)**  
   Add `public/_redirects` or `netlify.toml`:
   ```
   /*    /index.html   200
   ```

5. **Deploy**  
   Netlify builds and deploys. Your frontend URL will be like `https://brems-frontend.netlify.app`.

---

### 9.3 Vercel – Frontend (Alternative)

The project includes `vercel.json` with SPA rewrites. To deploy:

1. Go to [vercel.com](https://vercel.com) and import `hasan-nazmul/brems-frontend`
2. Add env var: `VITE_API_URL` = backend API URL
3. Deploy

---

### 9.4 TiDB Cloud – Database

TiDB Cloud is MySQL-compatible. Use it as the database for the Laravel backend.

1. **Create TiDB Cloud Account**  
   Go to [tidbcloud.com](https://tidbcloud.com).

2. **Create Cluster**  
   - Create a Dedicated or Serverless cluster  
   - Choose region  
   - Note: **Host**, **Port**, **Database**, **Username**, **Password**

3. **Whitelist IPs**  
   Add your Render/backend server IPs to the TiDB Cloud allowed list.

4. **Laravel `.env`**
   ```
   DB_CONNECTION=mysql
   DB_HOST=gateway01.xxx.prod.aws.tidbcloud.com
   DB_PORT=4000
   DB_DATABASE=brems
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   ```

5. **Run Migrations**  
   From Render build command or locally:
   ```bash
   php artisan migrate --force
   ```

---

### 9.5 Full Stack Deployment Checklist

| Step | Where | What |
|------|-------|------|
| 1 | TiDB Cloud | Create cluster, note connection string |
| 2 | Render | Deploy backend; set `DB_*`, `APP_URL`, `APP_KEY` |
| 3 | Netlify/Vercel | Deploy frontend; set `VITE_API_URL` = `https://your-backend.onrender.com/api` |
| 4 | CORS | Backend must allow frontend origin (e.g. `https://brems.netlify.app`) in `config/cors.php` |
| 5 | Test | Login, create employee, run reports, check exports |

---

## Appendix: Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `APP_KEY` | Laravel encryption key |
| `APP_URL` | Backend base URL |
| `DB_*` | Database connection |
| `CLOUDINARY_URL` | Optional file storage (format: `cloudinary://key:secret@cloud`) |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g. `https://api.example.com/api`) |

---

*Last updated for BREMS v1.0.0*
