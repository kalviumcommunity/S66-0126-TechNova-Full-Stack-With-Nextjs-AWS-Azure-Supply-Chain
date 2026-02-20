# Input Validation System

This directory contains Zod-based validation schemas for all API endpoints in ParkPulse.

## Overview

The validation system provides:

- ✅ Type-safe request validation
- ✅ Consistent error messages
- ✅ Automatic TypeScript type inference
- ✅ Reusable validation schemas
- ✅ Custom validation rules
- ✅ File upload validation

## File Structure

```
src/lib/validations/
├── common.ts          # Shared validation schemas
├── auth.ts            # Authentication schemas
├── parking-lot.ts     # Parking lot and spot schemas
├── booking.ts         # Booking schemas
├── report.ts          # Report schemas
└── README.md          # This file

src/lib/middleware/
└── validate.ts        # Validation middleware
```

## Available Schemas

### Common Schemas (`common.ts`)

- `emailSchema` - Email validation
- `passwordSchema` - Password with complexity requirements
- `phoneSchema` - Indian phone number (10 digits, starts with 6-9)
- `nameSchema` - Name validation (2-100 chars)
- `paginationSchema` - Page and limit parameters
- `uuidSchema` - UUID validation
- `coordinatesSchema` - Latitude/longitude
- `indianCitySchema` - Supported Indian cities
- `priceSchema` - Price in INR
- `futureDateSchema` - Future datetime validation
- `searchQuerySchema` - Search query string

### Auth Schemas (`auth.ts`)

- `signupSchema` - User registration with password confirmation
- `loginSchema` - Email and password login
- `changePasswordSchema` - Password change with confirmation
- `forgotPasswordSchema` - Request password reset
- `resetPasswordSchema` - Reset password with token
- `updateProfileSchema` - Update user profile

### Parking Lot Schemas (`parking-lot.ts`)

- `createParkingLotSchema` - Create new parking lot
- `updateParkingLotSchema` - Update parking lot (partial)
- `searchParkingLotsSchema` - Search with filters (city, price, location, etc.)
- `createParkingSpotSchema` - Create parking spot
- `updateParkingSpotSchema` - Update spot status
- `bulkCreateSpotsSchema` - Bulk create spots

### Booking Schemas (`booking.ts`)

- `createBookingSchema` - Create booking with time validation
- `updateBookingSchema` - Update booking status
- `cancelBookingSchema` - Cancel with reason
- `getUserBookingsSchema` - Get user bookings with filters
- `checkAvailabilitySchema` - Check spot availability
- `extendBookingSchema` - Extend booking end time

### Report Schemas (`report.ts`)

- `createReportSchema` - Submit availability/issue report
- `updateReportSchema` - Update report status (admin)
- `getReportsSchema` - Get reports with filters
- `verifyReportSchema` - Verify report (admin)

## Usage

### Method 1: Using `withValidation` HOF (Recommended)

```typescript
import { withValidation } from '@/lib/middleware/validate'
import { loginSchema } from '@/lib/validations/auth'
import { successResponse } from '@/lib/api-response'

export const POST = withValidation(
  async ({ body }) => {
    // body is validated and type-safe
    const user = await authenticateUser(body!.email, body!.password)
    return successResponse({ user })
  },
  {
    body: loginSchema,
  }
)
```

### Method 2: Manual Validation

```typescript
import { validateBody } from '@/lib/middleware/validate'
import { signupSchema } from '@/lib/validations/auth'
import { handleApiError, createdResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const validated = await validateBody(signupSchema, request)

    const user = await createUser(validated)
    return createdResponse({ user })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Method 3: Query Parameters

```typescript
import { withValidation } from '@/lib/middleware/validate'
import { searchParkingLotsSchema } from '@/lib/validations/parking-lot'

export const GET = withValidation(
  async ({ query }) => {
    const lots = await findParkingLots({
      city: query!.city,
      page: query!.page,
      limit: query!.limit,
    })
    return successResponse({ lots })
  },
  {
    query: searchParkingLotsSchema,
  }
)
```

### Method 4: Route Parameters

```typescript
import { withValidation } from '@/lib/middleware/validate'
import { uuidSchema } from '@/lib/validations/common'
import { z } from 'zod'

const paramsSchema = z.object({ id: uuidSchema })

export const GET = withValidation(
  async ({ params }) => {
    const lot = await findParkingLot(params!.id)
    return successResponse({ lot })
  },
  {
    params: paramsSchema,
  }
)
```

### Method 5: Combined Validation

```typescript
import { withValidation } from '@/lib/middleware/validate'
import { createBookingSchema } from '@/lib/validations/booking'

export const POST = withValidation(
  async ({ body, query, params }) => {
    // All validated and type-safe
    const booking = await createBooking({
      ...body!,
      userId: params!.userId,
    })
    return createdResponse({ booking })
  },
  {
    body: createBookingSchema,
    params: paramsSchema,
    query: querySchema,
  }
)
```

## Error Response Format

When validation fails, the API returns:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Invalid email format"
        },
        {
          "field": "password",
          "message": "Password must be at least 8 characters"
        }
      ]
    }
  }
}
```

HTTP Status: `422 Unprocessable Entity`

## Custom Validation

Create custom schemas using Zod:

```typescript
import { z } from 'zod'

const customSchema = z
  .object({
    email: z.string().email(),
    age: z.number().int().min(18),
  })
  .refine(
    (data) => {
      // Cross-field validation
      return data.email.includes('@company.com') || data.age >= 21
    },
    {
      message: 'Non-company emails require age 21+',
      path: ['email'],
    }
  )
```

## File Upload Validation

```typescript
import { validateFile, validateFiles } from '@/lib/middleware/validate'

export async function POST(request: NextRequest) {
  try {
    // Single file
    const file = await validateFile(request, 'profilePic', {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png'],
      required: true,
    })

    // Multiple files
    const images = await validateFiles(request, 'images', {
      maxSize: 2 * 1024 * 1024, // 2MB per file
      allowedTypes: ['image/jpeg', 'image/png'],
      maxCount: 5,
    })

    return successResponse({ uploaded: true })
  } catch (error) {
    return handleApiError(error)
  }
}
```

## Validation Rules

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Phone Number

- Indian format: 10 digits
- Must start with 6, 7, 8, or 9
- Example: `9876543210`

### Vehicle Number

- Indian format: `MH12AB1234`
- Pattern: `[State Code][District][Series][Number]`

### Booking Duration

- Minimum: 1 hour
- Maximum: 72 hours (3 days)
- End time must be after start time

### Supported Cities

- Mumbai
- Delhi
- Bangalore
- Pune
- Chennai
- Hyderabad
- Kolkata

## Type Safety

All schemas export TypeScript types:

```typescript
import type {
  SignupInput,
  LoginInput,
  CreateBookingInput,
  SearchParkingLotsInput,
} from '@/lib/validations/[module]'

const data: SignupInput = {
  email: 'user@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  name: 'John Doe',
}
```

## Best Practices

1. **Always use validation middleware** for API routes
2. **Use `withValidation` HOF** for cleaner code
3. **Export TypeScript types** from validation schemas
4. **Reuse common schemas** instead of duplicating
5. **Add custom refinements** for complex validation
6. **Validate early** - fail fast on invalid input
7. **Provide clear error messages** for users

## Testing Validation

```typescript
import { signupSchema } from '@/lib/validations/auth'

describe('Signup Validation', () => {
  it('should validate correct data', () => {
    const data = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      name: 'Test User',
    }

    const result = signupSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should reject weak password', () => {
    const data = {
      email: 'test@example.com',
      password: 'weak',
      confirmPassword: 'weak',
      name: 'Test User',
    }

    const result = signupSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
```

## Related Files

- **Error Handling**: `/src/lib/api-error.ts`
- **Response Formatting**: `/src/lib/api-response.ts`
- **API Types**: `/src/types/api.ts`
- **Prisma Schema**: `/prisma/schema.prisma`

## Resources

- [Zod Documentation](https://zod.dev/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
