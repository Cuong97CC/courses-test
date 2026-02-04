# Course Enrollment Portal - Frontend

A modern training course management portal built with React, Refine, and Ant Design. Features role-based access control for Students, Instructors, and Managers.

## 🛠️ Tech Stack

- **React** 18.2 - UI library
- **TypeScript** - Type safety
- **Refine** 4.x - CRUD framework
- **Ant Design** 5.x - UI components
- **React Router** v6 - Routing
- **Axios** - HTTP client
- **CKEditor 5** - Rich text editor
- **Vite** - Build tool
- **Day.js** - Date formatting

## 📋 Features

### Authentication

- JWT-based authentication
- Automatic token refresh
- Role-based access control (Student, Instructor, Manager)

### Course Management

- **List View:** Paginated table with status indicators (Open/Full/Ended)
- **Detail View:** Full course information with HTML content rendering
- **Create/Edit:** Rich text editor (CKEditor) for content
- **Permissions:**
  - Students: View public courses, enroll
  - Instructors: Create, edit courses
  - Managers: Full CRUD access

### Enrollment Management

- **Students:** Request enrollment, view own enrollments
- **Managers:** Approve/reject enrollment requests
- **Business Rules:**
  - Cannot enroll in full courses

## 🚀 Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Backend API running on `http://localhost:3000`

### Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**

   ```bash
   # Copy .env.example to .env
   cp .env.example .env

   # Edit .env if backend is not on localhost:3000
   # VITE_API_URL=http://localhost:3000
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📖 Usage

### Demo Accounts

Use these credentials to test different roles:

| Role           | Email                   | Password    |
| -------------- | ----------------------- | ----------- |
| **Student**    | student1@example.com    | password123 |
| **Instructor** | instructor1@example.com | password123 |
| **Manager**    | manager1@example.com    | password123 |

### User Flows

**Student:**

1. Login → Browse public courses
2. Click course → View details
3. Click "Enroll in this Course"
4. View "My Enrollments" to see status

**Manager:**

1. Login → View all enrollments
2. Click "Approve" or "Reject" for pending requests
3. Manage courses (create, edit, delete)

**Instructor:**

1. Login → Create new course
2. Edit course content using rich text editor

## 📁 Project Structure

```
src/
├── components/          # Shared components
│   └── Layout.tsx       # Main layout with sidebar
├── pages/              # Page components
│   ├── Login.tsx       # Authentication page
│   ├── courses/        # Course management
│   │   ├── list.tsx    # Course listing
│   │   ├── show.tsx    # Course details
│   │   ├── create.tsx  # Create course
│   │   └── edit.tsx    # Edit course
│   └── enrollments/    # Enrollment management
│       ├── list.tsx    # All enrollments (Manager)
│       └── my-enrollments.tsx  # Student view
├── providers/          # Refine providers
│   ├── authProvider.ts # JWT authentication
│   └── dataProvider.ts # REST API integration
├── types/              # TypeScript definitions
│   ├── user.ts
│   ├── course.ts
│   ├── enrollment.ts
│   └── index.ts
├── utils/              # Utilities
│   ├── axios.ts        # HTTP client with interceptors
│   ├── constants.ts    # Configuration
│   └── theme.ts        # Ant Design theme
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔧 Development

### Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 API Integration

### Base URL

Configure in `.env`:

```
VITE_API_URL=http://localhost:3000
```

## 🚀 Production Build

```bash
# Create optimized production build
npm run build

# The build output will be in the `dist/` folder
# Serve it with any static file server

# Preview production build locally
npm run preview
```

### Deployment Checklist

- [ ] Update `VITE_API_URL` in `.env` to production backend URL
- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Deploy `dist/` folder to hosting service (Vercel, Netlify, AWS S3, etc.)
- [ ] Configure CORS on backend to allow frontend domain

## 📝 Environment Variables

| Variable       | Description          | Default                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

## 🎨 Customization

### Theme Colors

Edit `src/utils/theme.ts` to customize:

```typescript
export const themeConfig = {
  token: {
    colorPrimary: '#0D9488', // Change primary color
    borderRadius: 8, // Button/card roundness
    fontFamily: "'Inter', ...", // Typography
  },
}
```
