# Telegram Mini App - Fullstack

A fullstack Telegram Mini App built with Vue.js frontend and NestJS backend.

## Project Structure

```
├── frontend/          # Vue.js frontend (TMA SDK)
├── backend/           # NestJS backend with Prisma & PostgreSQL
├── package.json       # Root workspace configuration
└── README.md
```

## Tech Stack

### Frontend
- Vue.js 3
- TypeScript
- Vite
- @tma.js/sdk-vue (Telegram Mini App SDK)
- TON Connect

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Telegram Bot API integration

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- Docker (for database)

### Installation

```bash
# Install all dependencies
npm install

# Or install workspace-specific dependencies
npm install --workspace=frontend
npm install --workspace=backend
```

### Development

```bash
# Start frontend development server
npm run frontend:dev

# Start backend development server
npm run backend:dev

# Start database (Docker required)
cd backend && npm run db:dev:up
```

### Building

```bash
# Build all projects
npm run build

# Build specific project
npm run frontend:build
npm run backend:build
```

### Linting & Testing

```bash
# Lint all projects
npm run lint

# Run tests
npm run test

# Frontend type-check
npm run frontend:type-check
```

## Environment Variables

### Backend
Copy `.env.example` to `.env` in the backend directory and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token

### Frontend
Configure environment in `frontend/.env` if needed.

## License

MIT
