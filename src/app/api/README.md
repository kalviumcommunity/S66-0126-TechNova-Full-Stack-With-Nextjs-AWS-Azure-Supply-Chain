# ParkPulse API Documentation

## Overview
This directory contains all API routes for the ParkPulse application, built using Next.js 14 App Router with file-based routing.

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://parkpulse.example.com/api`

## API Structure

```
/api
├── /health              # Health check endpoint
├── /auth                # Authentication endpoints
│   ├── /signup          # User registration
│   ├── /login           # User login
│   ├── /logout          # User logout
│   └── /refresh         # Token refresh
├── /parking-lots        # Parking lot management
│   ├── GET /            # List all parking lots (with filters)
│   ├── POST /           # Create parking lot (admin/owner)
│   ├── GET /[id]        # Get parking lot details
│   ├── PUT /[id]        # Update parking lot (admin/owner)
│   ├── DELETE /[id]     # Delete parking lot (admin)
│   └── GET /[id]/spots  # Get spots for a parking lot
├── /bookings            # Booking management
│   ├── GET /            # List user's bookings
│   ├── POST /           # Create new booking
│   ├── GET /[id]        # Get booking details
│   ├── PUT /[id]        # Update/cancel booking
│   └── DELETE /[id]     # Delete booking (admin)
├── /reports             # Crowd-sourced reports
│   ├── GET /            # List reports (with filters)
│   └── POST /           # Submit new report
├── /sensors             # IoT sensor data
│   ├── GET /            # List sensors (admin/owner)
│   ├── GET /[id]        # Get sensor details
│   └── PUT /[id]        # Update sensor status
├── /search              # Search endpoints
│   └── GET /            # Search parking lots
└── /upload              # File upload (future)
    └── POST /           # Upload images
```

## RESTful Conventions

### HTTP Methods
- **GET**: Retrieve resources (read-only)
- **POST**: Create new resources
- **PUT**: Update existing resources (full update)
- **PATCH**: Partial update (future use)
- **DELETE**: Remove resources

### Status Codes
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate booking)
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## Standard Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional validation errors
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Authentication

Most endpoints require authentication via JWT tokens.

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Public Endpoints (No Auth Required)
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/parking-lots` (read-only)
- `GET /api/parking-lots/[id]` (read-only)
- `GET /api/search`

### Protected Endpoints
All other endpoints require valid JWT authentication.

### Role-Based Access
- **USER**: Can create bookings, submit reports
- **PARKING_OWNER**: Can manage their parking lots
- **ADMIN**: Full access to all resources

## Query Parameters

### Filtering
```
GET /api/parking-lots?city=MUMBAI&pricePerHour[lte]=50
```

Supported operators:
- `[eq]` - Equal to (default)
- `[gt]` - Greater than
- `[gte]` - Greater than or equal
- `[lt]` - Less than
- `[lte]` - Less than or equal
- `[in]` - In array

### Sorting
```
GET /api/bookings?sortBy=createdAt&order=desc
```

### Pagination
```
GET /api/parking-lots?page=1&limit=20
```

### Search
```
GET /api/search?q=parking+near+airport&city=DELHI
```

## Example API Calls

### 1. User Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "phone": "+919876543210"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. List Parking Lots
```bash
GET /api/parking-lots?city=MUMBAI&status=AVAILABLE

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "lot_456",
      "name": "Gateway of India Parking",
      "city": "MUMBAI",
      "pricePerHour": 50,
      "availableSpots": 15,
      "totalSpots": 100
    }
  ]
}
```

### 3. Create Booking
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "parkingSpotId": "spot_789",
  "startTime": "2026-02-20T10:00:00Z",
  "endTime": "2026-02-20T14:00:00Z"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "booking_101",
    "userId": "usr_123",
    "parkingSpotId": "spot_789",
    "startTime": "2026-02-20T10:00:00Z",
    "endTime": "2026-02-20T14:00:00Z",
    "status": "CONFIRMED",
    "totalPrice": 200
  }
}
```

### 4. Submit Report
```bash
POST /api/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "parkingLotId": "lot_456",
  "reportType": "AVAILABILITY",
  "description": "Parking lot is currently full"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "report_202",
    "parkingLotId": "lot_456",
    "reportType": "AVAILABILITY",
    "description": "Parking lot is currently full",
    "isVerified": false,
    "createdAt": "2026-02-20T11:30:00Z"
  }
}
```

## Rate Limiting

- **Authenticated Users**: 100 requests per minute
- **Anonymous Users**: 20 requests per minute
- **Admin Users**: 500 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645357200
```

## Webhooks (Future)

Future support for webhooks to notify external systems of events:
- Booking created
- Parking lot status changed
- Report submitted

## CORS Policy

- **Development**: Allow all origins
- **Production**: Whitelist specific domains

## Error Codes Reference

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict |
| `BOOKING_CONFLICT` | Spot already booked for this time |
| `SPOT_UNAVAILABLE` | Parking spot not available |
| `PAYMENT_FAILED` | Payment processing failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## Versioning

Currently using **v1** (implicit). Future versions will use URL versioning:
- `/api/v1/...`
- `/api/v2/...`

## Testing

All API endpoints are covered by integration tests. See `/tests/api/` for examples.

Run API tests:
```bash
npm run test:api
```

## Additional Resources

- [API Conventions](../../docs/api-conventions.md)
- [Authentication Guide](../../docs/authentication.md) (future)
- [Database Schema](../../docs/database-schema.md) (future)

---

**Last Updated**: 2026-02-19  
**API Version**: v1  
**Maintained By**: ParkPulse Development Team
