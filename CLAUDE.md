# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server with hot reload
pnpm run start:dev

# Build the project
pnpm run build

# Run tests
pnpm run test              # Run all tests
pnpm run test:watch        # Run tests in watch mode
pnpm run test:cov          # Run tests with coverage
pnpm run test:e2e          # Run end-to-end tests

# Code quality
pnpm run format            # Format code with Prettier
pnpm run lint              # Run ESLint with auto-fix
```

## Architecture Overview

### Global Response Standardization

This application implements a standardized API response format across all endpoints using a global interceptor pattern:

**Response Structure:**
```typescript
{
  status: string;          // "success", "created", "bad_request", etc.
  code: number;            // HTTP status code
  message: string;         // Human-readable message
  data: T | null;          // Response payload
  timestamp: string;       // ISO 8601 timestamp
  errors: ServerError[] | null;
}
```

**Key Files:**
- `src/common/interceptors/response.interceptor.ts` - Transforms all responses globally
- `src/common/filters/http-exception.filter.ts` - Standardizes error handling
- `src/common/utils/serialization.util.ts` - Handles MongoDB ObjectId/Date serialization
- `src/common/interfaces/api-response.interface.ts` - Type definitions

**Important:** The interceptor automatically wraps ALL responses. Controllers return raw data, but clients receive the standardized format.

### MongoDB & TypeORM Integration

**Database Configuration:**
- TypeORM with MongoDB adapter
- Connection configured in `app.module.ts`
- Auto-discovery: Entities in `src/**/*.entity{.ts,.js}`

**Entity Patterns:**
- Use `@ObjectIdColumn()` for `_id` fields (not `@PrimaryGeneratedColumn()`)
- Implement `@BeforeInsert()` and `@BeforeUpdate()` hooks for timestamps (NOT `@CreateDateColumn`/`@UpdateDateColumn` which don't work reliably with MongoDB)
- Example timestamp management:
  ```typescript
  @BeforeInsert()
  setDatesBeforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }
  ```

**ObjectId Serialization:**
- MongoDB ObjectIds are automatically converted to strings via `serializeMongoData()` in the response interceptor
- Never return raw ObjectIds or Buffers to clients
- The serialization utility handles: ObjectId instances, Buffers, nested buffer structures

### Module Organization Pattern

Each domain module follows this structure:

```
src/{domain}/
├── dto/
│   ├── request/           # Input DTOs with class-validator decorators
│   │   ├── create-{domain}.dto.ts
│   │   ├── update-{domain}.dto.ts
│   │   └── {domain}-list-filter.dto.ts
│   └── response/          # Output DTOs with class-transformer decorators
│       ├── {domain}-response.dto.ts
│       └── {domain}-list-response.dto.ts
├── entities/
│   └── {domain}.entity.ts
├── {domain}.controller.ts
├── {domain}.service.ts
└── {domain}.repository.ts
```

**Layer Responsibilities:**
- **Controller**: HTTP handling, validation, returns raw entities
- **Service**: Business logic, uses `instanceToPlain()` for response DTO transformation
- **Repository**: Data access, MongoDB queries, pagination

### Pagination Pattern

List endpoints use POST method with filter DTOs (not GET with query params):

**Request:**
```typescript
POST /{resource}/list
Body: {
  pageNumber?: number = 1;
  pageSize?: number = 10;
  search?: string;
  // ... other filters
}
```

**Response Structure:**
```typescript
{
  status: "success",
  code: 200,
  message: "Resource retrieved successfully",
  data: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    items: T[];      // Note: "items" not "data" to avoid nesting
  },
  ...
}
```

**Repository Return Type:**
```typescript
Promise<{
  items: Entity[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>
```

### Type Safety Rules

- **No `any` types** - All code must be fully typed
- Repository methods return `Entity | null` for single results
- Use `as unknown as Type` only when TypeORM MongoDB requires it (documented with comment)
- Controller methods must have explicit return types

### Module Registration

Global features are registered in `app.module.ts`:
- `APP_INTERCEPTOR` for ResponseInterceptor
- `APP_FILTER` for HttpExceptionFilter
- Domain modules imported in `imports` array

### Common Patterns

**Repository Query Pattern:**
```typescript
// For single documents
return await this.repository.findOne({ where: { _id: new ObjectId(id) } });

// For updates with return value
return await this.repository.findOneAndUpdate(
  { _id: new ObjectId(id) },
  { $set: updateDto },
  { returnDocument: 'after' }
) as unknown as Entity;

// For pagination
const items = await this.repository.find({
  where: filter,
  skip: (pageNumber - 1) * pageSize,
  take: pageSize,
  order: { createdAt: 'DESC' }
});
```

**Service DTO Transformation:**
```typescript
import { instanceToPlain } from 'class-transformer';

async findOne(id: string): Promise<ResponseDto> {
  const entity = await this.repository.findById(id);
  return instanceToPlain(entity, { groups: ['response'] }) as ResponseDto;
}
```

**MongoDB Filter Types:**
Define filter types explicitly instead of using `any`:
```typescript
type MongoFilter = {
  field?: { $regex: string; $options?: string };
  nested?: { $gte?: number; $lte?: number };
};
```
