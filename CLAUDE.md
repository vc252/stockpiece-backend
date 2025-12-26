# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stockpiece Backend - A TypeScript/Node.js Express API for a One Piece-themed stock trading simulation game. Built with MongoDB, Cloudinary for image storage, and a custom dependency injection container.

## Development Commands

### Essential Commands

```bash
# Build TypeScript to JavaScript (outputs to dist/)
npm run build

# Development (with auto-reload via nodemon)
npm run dev:ready        # Format + lint + build + start dev server
npm run dev              # Start dev server (requires manual build first)

# Production
npm run start            # Start production server
npm run start:ready      # Verify + build + start production

# Code Quality
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run ready            # Format + lint + type-check (no build)

# Type Checking
tsc --noEmit            # Type-check without building
```

### Environment Setup

Set `NODE_ENV` before running:
- `development` → loads `.env.development`
- `production` → loads `.env.production`
- `testing` → loads `.env.test`

Environment variables are validated via Zod schema in `src/config/env.config.ts`.

## Architecture Overview

### Dependency Injection (DI) Container

The application uses a **custom singleton DI Container** pattern (`src/container/Container.ts`):

1. **Registration Phase**: All components (Services, Repositories, Controllers) are registered in `ComponentsDef.ts` with their dependencies
2. **Resolution Phase**: Container resolves dependencies recursively and creates singleton instances
3. **Component Lifecycle**: All registered components are eagerly instantiated at startup (see `setUpComponent.container.ts`)

Key files:
- `src/container/Container.ts` - DI container implementation
- `src/config/ComponentsDef.ts` - Component registry and dependency graph
- `src/container/setUpComponent.container.ts` - Component registration logic

### Layered Architecture

**Request Flow**: Router → Controller → Service → Repository → Database

1. **Routers** (`src/router/`)
   - Extend `BaseRouter` abstract class
   - Define routes and attach middleware
   - Resolve controllers from DI container
   - Registered in `routesDefs.ts` with base paths (e.g., `/api/v2/user`)

2. **Controllers** (`src/controllers/`)
   - Extend `BaseController` abstract class
   - Handle HTTP requests/responses
   - Use `ApiResponse` wrapper for consistent response format
   - Wrapped in `asyncHandler` utility for error handling

3. **Services** (`src/services/`)
   - Extend `BaseService` abstract class
   - Business logic layer
   - Orchestrate repository calls and external services
   - Handle file uploads, image processing, etc.

4. **Repositories** (`src/repositories/`)
   - Direct database access layer
   - Plain classes (no base class)
   - Parse DB responses with Zod schemas via `parseDbResponseOrThrow`
   - Always return parsed, type-safe data

5. **Models** (`src/models/`)
   - Mongoose schemas and models
   - Define database structure

### Key Patterns

**Validation**: Zod schemas are used throughout:
- Request validation: `src/middlewares/validationMiddleware.ts`
- Schema definitions: `src/schemas/`
- DB response parsing: `parseDbResponseOrThrow` in repositories

**Error Handling**:
- Centralized error handler: `src/middlewares/errorHandlerMiddleware.ts`
- Standard errors: `src/common/HttpResponse.ts` (HttpError/HttpSuccess constants)
- Custom ApiError class: `src/common/ApiError.ts`
- Use `getApiError()` helper to throw standardized errors

**Authentication**:
- JWT-based auth with access/refresh tokens
- User vs Admin tokens have different expiry times
- Auth middleware: `src/middlewares/authMiddleware.ts`
- JWT utilities: `src/utils/jwt.ts`

**File Uploads**:
- Multer middleware: `src/middlewares/multerMiddleware.ts`
- Cloudinary integration: `src/services/FileUploaderService.ts`
- Image processing: `src/services/ImageProcessingService.ts` (uses Sharp)

**Logging**:
- Winston logger: `src/utils/logger.ts`
- MongoDB transport in production
- Custom log levels (notice, error, etc.)

**Trading Windows**:
- State machine with strictly defined status transitions
- Status flow: OPEN → TRADING → TRADE_CLOSED → SETTLING → SETTLED → CLOSED
- Valid transitions defined in `src/common/constants.ts` (`validStatusTransitions`)
- Always validate state transitions using the defined mappings

## Important Constants & Types

**Roles**: USER, ADMIN (see `src/common/constants.ts`)

**Permissions**: Market control, stock management, user impersonation, etc.

**Window Types**: chapter, bonus, week

**Window Status**: open, trading, trade_closed, paused, settling, settled, closed, cancelled

## File Naming Conventions

- TypeScript source files use `.ts` extension
- Compiled JavaScript uses `.js` extension
- **Import statements MUST use `.js` extension** (required for ES modules): `import X from "./file.js"`
- ESLint enforces this via `import/extensions` rule

## Code Style

- ES2020 modules (`type: "module"` in package.json)
- Strict TypeScript mode enabled
- Arrow functions for class methods (`public readonly methodName = async () => {}`)
- Underscore prefix (`_`) for unused parameters
- Husky pre-commit hook runs lint-staged (prettier + eslint)

## Adding New Features

### Adding a New Entity (e.g., Transaction)

1. **Create Model** in `src/models/` with Mongoose schema
2. **Create Zod Schema** in `src/schemas/` for validation
3. **Create Types** in `src/types/` for TypeScript types
4. **Create Repository** in `src/repositories/` for DB operations
5. **Create Service** in `src/services/` extending `BaseService`
6. **Create Controller** in `src/controllers/` extending `BaseController`
7. **Register in DI Container** in `src/config/ComponentsDef.ts`:
   - Add to `ComponenetsDef` array with dependencies
   - Add to `ComponentName` type union
8. **Create Router** in `src/router/` extending `BaseRouter`
9. **Register Router** in `src/config/routesDefs.ts`

### Adding a New Route to Existing Router

1. Add Zod schema in `src/schemas/` if needed
2. Add controller method with proper typing
3. Add route definition in router's `configurRoutes()` method
4. Chain middleware: validation → auth → business logic

Example:
```typescript
this.router
  .route("/endpoint")
  .post(
    validateRequestBody(mySchema),
    verifyUserJwt,
    asyncHandler(this.controller.myMethod)
  );
```

## Database

- MongoDB via Mongoose
- Connection: `src/config/db.config.ts`
- Database name: "stockpiece"
- Collections defined in `src/common/constants.ts`

## Super Admin Initialization

On server startup, a super admin is created if it doesn't exist:
- Username, password, email from environment variables
- Gets all permissions
- Logic in `src/server.ts` (`initSuperAdmin()`)

## Common Issues

**Import Errors**: Always use `.js` extension in imports, not `.ts`

**Validation Errors**: Ensure Zod schemas match TypeScript types

**DI Resolution**: Components must be registered in `ComponentsDef.ts` before use

**Status Transitions**: When updating window status, validate against `validStatusTransitions` map

**Environment Variables**: Must be defined in appropriate `.env.*` file and in `envSchema` in `env.config.ts`
