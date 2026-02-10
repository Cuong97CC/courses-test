# Course & Enrollment Portal - Backend API

A training course management system where staff can manage courses and enrollment approvals. Students can request enrollment in multiple courses, and managers approve/reject these requests.

## 📋 Features

### Core Functionality

- **Course Management**: Create, view, update, and delete training courses
- **Enrollment System**: Students request enrollment, managers approve/reject
- **Role-Based Access Control**: Three user roles (Student, Instructor, Manager)
- **Course Versioning**: Track history of course modifications with optimistic locking
- **Visibility Control**: Public/private course visibility settings
- **Capacity Management**: Enrollment limits with distributed locking to prevent race conditions

### Authentication & Authorization

- JWT-based authentication with refresh tokens
- Access tokens (15 minutes expiration)
- Refresh tokens (7 days expiration)
- Token revocation using Redis (not implemented yet)
- Role-based endpoint protection

### Environment Configuration

Create a `.env` file base on `.env.example`

### Generate RSA Key Pair

Generate keys for jwt and refresh token (use the same keys for jwt and refresh token for local development, production keys should be different)

```bash
sh ./scripts/generate-keys.sh
```

### Run project

```bash
docker compose up
```

#### Run Migrations

```bash
docker compose exec api npm run migration:run
```

#### (Optional) Seed Sample Data

```bash
docker compose exec api npm run seed:run
```

**Default Users**:
| Email | Password | Role |
|-------|----------|------|
| student1@example.com | password123 | Student |
| instructor1@example.com | password123 | Instructor |
| manager1@example.com | password123 | Manager |

#### Production Mode

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/docs
```

## 🧪 Testing

Only some part of project is covered with unit test.

### Run Unit Tests

```bash
npm run test
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## 🛠 Development Scripts

```bash
# Development
npm run start              # Start in development mode
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debugging

# Build
npm run build              # Build for production

# Database
npm run migration:generate # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run seed:run           # Run seed data

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests
```
