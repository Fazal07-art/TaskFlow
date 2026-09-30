# TaskFlow - Modern Full-Stack Task Management SaaS Application

**TaskFlow** is a modern, responsive, and secure task management SaaS web application built with a full-stack JavaScript architecture. It enables users to streamline project planning, organize workflow priorities, track progress with real-time statistics, and securely manage their work items.

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- **JWT-Based Authentication**: Secure stateless authentication using Bearer tokens.
- **Password Hashing**: Strong password encryption via `bcryptjs` with salt rounds.
- **Session Persistence**: Automatic token detection and re-validation on page reload.
- **Protected Routes**: Navigation guards on the frontend and authorization middleware on the backend.
- **Strict User Isolation**: Database queries scoped exclusively to the authenticated user ID (`req.user._id`), preventing data leakage.
- **Input Validation & Sanitization**: Comprehensive validation on registration, login, and task schemas.

### 📋 2. Comprehensive Task Management
- **Full CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Multi-Level Statuses**: Track tasks across `Pending`, `In Progress`, and `Completed`.
- **Priority Categorization**: Set and filter tasks by `Low`, `Medium`, and `High` priorities.
- **Deadlines & Overdue Detection**: Interactive date pickers, automated overdue calculations, and visual warning badges.
- **Inline Status Transitions**: Change task statuses directly from cards or tables without opening modals.
- **Search & Advanced Filtering**: Live search by keyword across title and description, filter by status and priority, and multi-field sorting (Date Created, Due Date, Title, Priority).
- **Dual View Modes**: Switch seamlessly between Grid View and List View.

### 📊 3. Modern Interactive Dashboard
- **Real-Time Analytics**:
  - Total Tasks
  - Pending Tasks
  - In Progress Tasks
  - Completed Tasks
  - High-Priority Tasks
- **Progress Gauge**: Visual task completion percentage meter.
- **Quick Action Launchers**: Global "+ New Task" modal triggers from header and sidebar.
- **Recent Activity Feed**: Quick overview of recent tasks with direct edit and delete capabilities.

### 🎨 4. Modern SaaS User Interface
- **Responsive Layout**: Designed for mobile, tablet, laptop, and ultra-wide desktop viewports.
- **Collapsible Sidebar & Off-Canvas Mobile Drawer**: Adapts dynamically with backdrop dismissals.
- **Micro-Interactions**: Smooth state transitions, toast notification alerts, skeleton spinners, and empty state illustrations.
- **Customizable User Profile**: Update name, change email, and update password with credential verification.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 | Declarative component UI library |
| | Vite 6 | High-speed frontend build tooling & HMR |
| | Tailwind CSS | Utility-first responsive design system |
| | React Router DOM v6 | Declarative client-side routing & navigation guards |
| | Axios | HTTP client with request & response interceptors |
| | Lucide React | Clean, accessible iconography |
| **Backend** | Node.js | Runtime environment |
| | Express.js | REST API web framework |
| | JSON Web Tokens (`jsonwebtoken`) | Stateless authentication tokens |
| | `bcryptjs` | Salted password hashing |
| | CORS & Dotenv | Cross-origin resource sharing & configuration |
| **Database** | MongoDB & Mongoose | Document database with schema validation & compound indexes |
| | `mongodb-memory-server` | Zero-configuration fallback engine ensuring instant local run |

---

## 📁 Project Structure

```text
TaskFlow/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic with zero-config fallback
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me, Profile update handlers
│   │   └── taskController.js     # Task CRUD, filters, and dashboard stats
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & route protection
│   │   └── errorMiddleware.js    # Global error handling & Mongoose formatters
│   ├── models/
│   │   ├── User.js               # User schema, password hooks & methods
│   │   └── Task.js               # Task schema, enums & compound indexes
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   └── taskRoutes.js         # /api/tasks endpoints
│   ├── .env                      # Local environment configuration
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies and scripts
│   ├── server.js                 # Express server bootstrap & route mounting
│   └── test-api.js               # Automated end-to-end integration test suite
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx # Accessible delete confirmation modal
│   │   │   ├── EmptyState.jsx         # Empty illustration with action buttons
│   │   │   ├── Layout.jsx             # Shell combining Navbar and Sidebar
│   │   │   ├── LoadingSpinner.jsx     # Animated SVG loading spinner
│   │   │   ├── Navbar.jsx             # Top bar with user dropdown & actions
│   │   │   ├── PriorityBadge.jsx      # Visual priority chips
│   │   │   ├── ProtectedRoute.jsx     # Auth state route gate
│   │   │   ├── Sidebar.jsx            # Desktop sidebar and mobile drawer
│   │   │   ├── StatCard.jsx           # Dashboard metric cards
│   │   │   ├── StatusBadge.jsx        # Visual status chips
│   │   │   ├── TaskCard.jsx           # Task presentation & quick status updater
│   │   │   └── TaskModal.jsx          # Create/Edit task modal with validation
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Auth state provider and persistent session
│   │   │   └── ToastContext.jsx       # Floating notifications manager
│   │   ├── hooks/
│   │   │   └── useAuth.js             # Hook to access auth context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Metrics, completion progress, recent tasks
│   │   │   ├── Login.jsx              # SaaS user sign-in page
│   │   │   ├── NotFound.jsx           # 404 error page with navigation back
│   │   │   ├── Profile.jsx            # Account details & password management
│   │   │   ├── Register.jsx           # SaaS user registration page
│   │   │   └── Tasks.jsx              # Search, filter, sorting, grid/list tasks
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   ├── authService.js         # Auth API client
│   │   │   └── taskService.js         # Task API client
│   │   ├── App.jsx                    # Routing configuration
│   │   ├── index.css                  # Tailwind styles and base overrides
│   │   └── main.jsx                   # React DOM root
│   ├── .env                       # Frontend environment configuration
│   ├── .env.example               # Frontend template
│   ├── index.html                 # HTML template with Plus Jakarta Sans font
│   ├── package.json               # Frontend dependencies and scripts
│   ├── postcss.config.js          # PostCSS configuration
│   ├── tailwind.config.js         # Tailwind color palette & font settings
│   └── vite.config.js             # Vite configuration with API reverse proxy
│
├── .gitignore
├── package.json                   # Root orchestrator scripts
└── README.md                      # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended; tested on v24)
- **npm** (v9 or higher)
- **MongoDB** *(Optional)*: If you have a local MongoDB daemon or MongoDB Atlas URI, specify it in `backend/.env`. If not, the application automatically boots an embedded in-memory MongoDB engine with zero configuration needed.

---

### Installation

1. **Clone or open the project directory**:
   ```bash
   cd TaskFlow
   ```

2. **Install all dependencies (Frontend & Backend)**:
   ```bash
   npm run install:all
   ```
   *(Or individually: `npm install --prefix backend` and `npm install --prefix frontend`)*

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

> **Note**: If your local MongoDB server is not running on port 27017, TaskFlow will automatically fallback to an in-memory database so you can test and use the application without manual database setup.

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### 1. Start the Backend API Server
In a terminal window:
```bash
npm run backend
# or
cd backend && npm run dev
```
The API server starts at `http://localhost:5000`.

### 2. Start the Frontend Application
In another terminal window:
```bash
npm run frontend
# or
cd frontend && npm run dev
```
The Vite development server starts at `http://localhost:5173`. Open this URL in your web browser.

---

## 🧪 Running Automated Verification Tests

TaskFlow includes an end-to-end backend integration test verifying health, user registration, token authentication, user profile fetching, full task CRUD, statistics computation, and user isolation:

```bash
npm test
# or
npm test --prefix backend
```

---

## 📡 REST API Documentation

### Base URL: `/api`

### 1. Authentication Endpoints

#### Register User
- **Method / Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Account registered successfully",
    "token": "eyJhbGciOi...",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Sarah Connor",
      "email": "sarah@example.com",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
  ```

#### Login User
- **Method / Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "sarah@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "token": "eyJhbGciOi...",
    "user": { ... }
  }
  ```

#### Get Current User Profile
- **Method / Endpoint**: `GET /api/auth/me`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Response** (`200 OK`): Returns current authenticated user record without password.

#### Update User Profile & Password
- **Method / Endpoint**: `PUT /api/auth/profile`
- **Access**: Private (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "name": "Sarah Connor Updated",
    "email": "sarah.new@example.com",
    "currentPassword": "Password123!",
    "newPassword": "NewSecurePassword456!"
  }
  ```

---

### 2. Task Management Endpoints

All task endpoints require `Authorization: Bearer <token>`.

#### Get Tasks (with Search, Filter, & Sort)
- **Method / Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `search` (string): Keyword matching title or description
  - `status` (`Pending` | `In Progress` | `Completed`)
  - `priority` (`Low` | `Medium` | `High`)
  - `sortBy` (`createdAt` | `dueDate` | `priority` | `title`)
  - `sortOrder` (`asc` | `desc`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 2,
    "tasks": [ ... ]
  }
  ```

#### Get Task Metrics & Dashboard Statistics
- **Method / Endpoint**: `GET /api/tasks/stats`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "stats": {
      "total": 12,
      "pending": 4,
      "inProgress": 3,
      "completed": 5,
      "highPriority": 2,
      "overdue": 1
    }
  }
  ```

#### Get Single Task by ID
- **Method / Endpoint**: `GET /api/tasks/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "task": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Launch Marketing Campaign",
      "description": "Coordinate social announcements",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2025-04-15T00:00:00.000Z",
      "user": "60d0fe4f5311236168a109ca",
      "createdAt": "2025-04-01T10:00:00.000Z",
      "updatedAt": "2025-04-01T10:30:00.000Z"
    }
  }
  ```

#### Create New Task
- **Method / Endpoint**: `POST /api/tasks`
- **Request Body**:
  ```json
  {
    "title": "Prepare Financial Report",
    "description": "Review Q1 metrics and revenue streams",
    "status": "Pending",
    "priority": "High",
    "dueDate": "2025-04-30"
  }
  ```
- **Response** (`201 Created`): Returns created task record.

#### Update Task
- **Method / Endpoint**: `PUT /api/tasks/:id`
- **Request Body**: Accepts partial updates for `title`, `description`, `status`, `priority`, or `dueDate`.
- **Response** (`200 OK`): Returns updated task record.

#### Delete Task
- **Method / Endpoint**: `DELETE /api/tasks/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "taskId": "60d0fe4f5311236168a109cb"
  }
  ```

---

## 🔮 Future Improvements
- **Kanban Drag-and-Drop Board**: Visual column drag-and-drop to update statuses.
- **Collaborative Workspaces**: Multi-user shared boards and project assignment.
- **Activity Audit Trail**: History of changes and activity logs for each task.
- **File Attachments**: Direct document and screenshot uploads via cloud storage (S3/Cloudinary).
- **Subtasks & Checklists**: Nested sub-task progression tracking.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
