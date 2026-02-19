# Database Migrations & Seed Data

## Overview

This directory contains Prisma schema, migrations, and seed scripts for the ParkPulse database.

## Database Schema

The schema includes 6 core models:

- **User**: Authentication and role-based access control
- **ParkingLot**: Parking locations across 5 Indian cities
- **ParkingSpot**: Individual parking spots with real-time status
- **Booking**: Reservation and payment tracking
- **Report**: Crowd-sourced availability reports
- **Sensor**: IoT sensor simulation for real-time detection

## Running Migrations

### Initial Setup

1. Ensure PostgreSQL is running (via Docker or local installation)
2. Set DATABASE_URL in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/parkpulse"
   ```

### Create and Run Migration

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Or push schema directly (development only)
npm run prisma:push
```

### View Database

```bash
# Open Prisma Studio
npm run prisma:studio
```

## Seeding the Database

The seed script (`seed.ts`) populates the database with realistic test data:

### What Gets Seeded:

- **4 Test Users**:
  - Admin: `admin@parkpulse.com` / `password123`
  - Regular User: `user@parkpulse.com` / `password123`
  - Parking Owner 1: `owner1@parkpulse.com` / `password123`
  - Parking Owner 2: `owner2@parkpulse.com` / `password123`

- **58 Parking Lots** across 5 cities:
  - Mumbai: 15 locations
  - Delhi: 12 locations
  - Bangalore: 13 locations
  - Pune: 8 locations
  - Chennai: 10 locations

- **8,000+ Parking Spots**:
  - 40% Two-wheeler spots
  - 50% Four-wheeler spots
  - 5% Disabled-accessible spots
  - 5% EV charging spots

- **2,400+ IoT Sensors**:
  - Randomly assigned to 30% of parking spots
  - Types: ULTRASONIC, CAMERA, MAGNETIC
  - Simulated battery levels and ping times

- **20 Sample Reports**:
  - Crowd-sourced availability and issue reports

### Run Seed Script

```bash
npm run prisma:seed
```

## Database Reset

To completely reset and reseed the database:

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Run all migrations
# 4. Run the seed script automatically
```

## Migration Best Practices

1. **Always create migrations for schema changes**

   ```bash
   npx prisma migrate dev --name descriptive-migration-name
   ```

2. **Never edit existing migrations** - Create new ones instead

3. **Test migrations locally** before deploying to production

4. **Use meaningful migration names**:
   - `add-user-roles`
   - `add-parking-spot-indexes`
   - `update-booking-status-enum`

## Production Deployment

For production, use:

```bash
# Generate client
npx prisma generate

# Run migrations (doesn't seed)
npx prisma migrate deploy
```

## Troubleshooting

### "Database does not exist"

```bash
# Create database manually
npx prisma db push
```

### "Migration failed"

```bash
# Reset and try again
npx prisma migrate reset
```

### "Prisma Client not found"

```bash
# Regenerate client
npm run prisma:generate
```

## Seed Data Highlights

### Major Parking Hubs:

- **Mumbai**: Bandra Kurla Complex (120 spots), Phoenix Mall (300 spots)
- **Delhi**: Connaught Place (250 spots), Aerocity Airport (400 spots)
- **Bangalore**: Whitefield ITPL (350 spots), Electronic City (300 spots)
- **Pune**: Hinjewadi IT Park (400 spots), Magarpatta City (250 spots)
- **Chennai**: OMR IT Corridor (300 spots), Marina Beach (200 spots)

### Pricing Range:

- Budget: ₹30-40/hour (suburban areas)
- Standard: ₹45-65/hour (city areas)
- Premium: ₹70-100/hour (business districts, malls, airports)

### Amenities:

- 24/7 Security & CCTV
- Covered parking
- Valet services (premium locations)
- EV charging stations
- Metro/Railway connectivity
