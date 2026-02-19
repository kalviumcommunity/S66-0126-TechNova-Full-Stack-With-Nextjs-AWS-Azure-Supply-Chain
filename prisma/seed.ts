import {
  PrismaClient,
  Role,
  VehicleType,
  SpotStatus,
  SensorType,
} from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.sensor.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.report.deleteMany()
  await prisma.parkingSpot.deleteMany()
  await prisma.parkingLot.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  console.log('👥 Creating test users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@parkpulse.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+919876543210',
      role: Role.ADMIN,
    },
  })

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@parkpulse.com',
      password: hashedPassword,
      name: 'Regular User',
      phone: '+919876543211',
      role: Role.USER,
    },
  })

  const parkingOwner1 = await prisma.user.create({
    data: {
      email: 'owner1@parkpulse.com',
      password: hashedPassword,
      name: 'Parking Owner 1',
      phone: '+919876543212',
      role: Role.PARKING_OWNER,
    },
  })

  const parkingOwner2 = await prisma.user.create({
    data: {
      email: 'owner2@parkpulse.com',
      password: hashedPassword,
      name: 'Parking Owner 2',
      phone: '+919876543213',
      role: Role.PARKING_OWNER,
    },
  })

  console.log('✅ Created 4 test users')

  // Parking lot data for 5 Indian cities
  const parkingLotsData = [
    // Mumbai - 15 parking lots
    {
      name: 'Gateway of India Parking',
      address: 'Apollo Bunder, Colaba',
      city: 'Mumbai',
      latitude: 18.922,
      longitude: 72.8347,
      totalSpots: 50,
      pricePerHour: 60,
      amenities: {
        security: true,
        cctv: true,
        covered: false,
        evCharging: false,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Bandra Kurla Complex Parking',
      address: 'BKC, Bandra East',
      city: 'Mumbai',
      latitude: 19.0596,
      longitude: 72.8656,
      totalSpots: 120,
      pricePerHour: 80,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        evCharging: true,
        valet: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Marine Drive Parking Plaza',
      address: 'Netaji Subhash Chandra Marg',
      city: 'Mumbai',
      latitude: 18.9432,
      longitude: 72.8236,
      totalSpots: 80,
      pricePerHour: 70,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Andheri Metro Station Parking',
      address: 'Western Express Highway, Andheri',
      city: 'Mumbai',
      latitude: 19.1197,
      longitude: 72.8464,
      totalSpots: 200,
      pricePerHour: 50,
      amenities: {
        security: true,
        cctv: true,
        covered: false,
        metroAccess: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Powai Lake Side Parking',
      address: 'Powai, Mumbai',
      city: 'Mumbai',
      latitude: 19.1176,
      longitude: 72.906,
      totalSpots: 60,
      pricePerHour: 40,
      amenities: { security: true, cctv: false, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Phoenix Mall Parking',
      address: 'Lower Parel',
      city: 'Mumbai',
      latitude: 19.008,
      longitude: 72.8314,
      totalSpots: 300,
      pricePerHour: 90,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        valet: true,
        evCharging: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Churchgate Station Parking',
      address: 'Veer Nariman Road, Churchgate',
      city: 'Mumbai',
      latitude: 18.9354,
      longitude: 72.8274,
      totalSpots: 100,
      pricePerHour: 65,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Juhu Beach Parking',
      address: 'Juhu Tara Road',
      city: 'Mumbai',
      latitude: 19.099,
      longitude: 72.8265,
      totalSpots: 75,
      pricePerHour: 45,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Worli Sea Link Plaza Parking',
      address: 'Worli',
      city: 'Mumbai',
      latitude: 19.0176,
      longitude: 72.8162,
      totalSpots: 90,
      pricePerHour: 75,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Nariman Point Business Hub',
      address: 'Nariman Point',
      city: 'Mumbai',
      latitude: 18.9258,
      longitude: 72.8243,
      totalSpots: 150,
      pricePerHour: 100,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        valet: true,
        evCharging: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Dadar Station East Parking',
      address: 'Dadar East',
      city: 'Mumbai',
      latitude: 19.0189,
      longitude: 72.8478,
      totalSpots: 110,
      pricePerHour: 55,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Mulund West Parking Complex',
      address: 'LBS Marg, Mulund West',
      city: 'Mumbai',
      latitude: 19.172,
      longitude: 72.9565,
      totalSpots: 85,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Borivali National Park Parking',
      address: 'Borivali East',
      city: 'Mumbai',
      latitude: 19.2304,
      longitude: 72.8679,
      totalSpots: 200,
      pricePerHour: 30,
      amenities: { security: true, cctv: false, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Goregaon Film City Parking',
      address: 'Film City Road, Goregaon',
      city: 'Mumbai',
      latitude: 19.1625,
      longitude: 72.85,
      totalSpots: 130,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Thane Station Parking',
      address: 'Thane Railway Station',
      city: 'Mumbai',
      latitude: 19.1871,
      longitude: 72.978,
      totalSpots: 180,
      pricePerHour: 45,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },

    // Delhi - 12 parking lots
    {
      name: 'India Gate Parking',
      address: 'Rajpath, Central Delhi',
      city: 'Delhi',
      latitude: 28.6129,
      longitude: 77.2295,
      totalSpots: 100,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Connaught Place Central Parking',
      address: 'Block A, Connaught Place',
      city: 'Delhi',
      latitude: 28.6315,
      longitude: 77.2167,
      totalSpots: 250,
      pricePerHour: 80,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        evCharging: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Rajiv Chowk Metro Parking',
      address: 'Rajiv Chowk Metro Station',
      city: 'Delhi',
      latitude: 28.6328,
      longitude: 77.2197,
      totalSpots: 180,
      pricePerHour: 60,
      amenities: {
        security: true,
        cctv: true,
        covered: false,
        metroAccess: true,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Saket District Centre Parking',
      address: 'Saket, South Delhi',
      city: 'Delhi',
      latitude: 28.5244,
      longitude: 77.2066,
      totalSpots: 300,
      pricePerHour: 70,
      amenities: { security: true, cctv: true, covered: true, valet: true },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Chandni Chowk Parking Plaza',
      address: 'Chandni Chowk, Old Delhi',
      city: 'Delhi',
      latitude: 28.6507,
      longitude: 77.2334,
      totalSpots: 120,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Nehru Place Tech Hub Parking',
      address: 'Nehru Place',
      city: 'Delhi',
      latitude: 28.5494,
      longitude: 77.2501,
      totalSpots: 200,
      pricePerHour: 65,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        evCharging: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Karol Bagh Market Parking',
      address: 'Karol Bagh',
      city: 'Delhi',
      latitude: 28.6512,
      longitude: 77.1905,
      totalSpots: 90,
      pricePerHour: 45,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Hauz Khas Village Parking',
      address: 'Hauz Khas',
      city: 'Delhi',
      latitude: 28.5494,
      longitude: 77.1932,
      totalSpots: 70,
      pricePerHour: 55,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Dwarka Sector 21 Metro Parking',
      address: 'Dwarka Sector 21',
      city: 'Delhi',
      latitude: 28.5521,
      longitude: 77.059,
      totalSpots: 220,
      pricePerHour: 50,
      amenities: {
        security: true,
        cctv: true,
        covered: false,
        metroAccess: true,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Lajpat Nagar Market Parking',
      address: 'Lajpat Nagar',
      city: 'Delhi',
      latitude: 28.5677,
      longitude: 77.2433,
      totalSpots: 85,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Aerocity Terminal 3 Parking',
      address: 'Aerocity, IGI Airport',
      city: 'Delhi',
      latitude: 28.5562,
      longitude: 77.118,
      totalSpots: 400,
      pricePerHour: 100,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        valet: true,
        evCharging: true,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Kashmere Gate ISBT Parking',
      address: 'Kashmere Gate',
      city: 'Delhi',
      latitude: 28.6676,
      longitude: 77.2268,
      totalSpots: 150,
      pricePerHour: 35,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },

    // Bangalore - 13 parking lots
    {
      name: 'MG Road Central Parking',
      address: 'Mahatma Gandhi Road',
      city: 'Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      totalSpots: 150,
      pricePerHour: 60,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Indiranagar 100 Feet Road Parking',
      address: 'Indiranagar',
      city: 'Bangalore',
      latitude: 12.9784,
      longitude: 77.6408,
      totalSpots: 100,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Koramangala Forum Mall Parking',
      address: 'Koramangala 7th Block',
      city: 'Bangalore',
      latitude: 12.9344,
      longitude: 77.6101,
      totalSpots: 280,
      pricePerHour: 70,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        valet: true,
        evCharging: true,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Whitefield ITPL Parking',
      address: 'Whitefield, ITPL Main Road',
      city: 'Bangalore',
      latitude: 12.985,
      longitude: 77.7294,
      totalSpots: 350,
      pricePerHour: 55,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        evCharging: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'HSR Layout Parking Hub',
      address: 'HSR Layout Sector 1',
      city: 'Bangalore',
      latitude: 12.9121,
      longitude: 77.6446,
      totalSpots: 120,
      pricePerHour: 45,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Electronic City Phase 1 Parking',
      address: 'Electronic City',
      city: 'Bangalore',
      latitude: 12.8399,
      longitude: 77.677,
      totalSpots: 300,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Jayanagar 4th Block Parking',
      address: 'Jayanagar 4th Block',
      city: 'Bangalore',
      latitude: 12.925,
      longitude: 77.5937,
      totalSpots: 80,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Malleshwaram Metro Parking',
      address: 'Malleshwaram',
      city: 'Bangalore',
      latitude: 13.0024,
      longitude: 77.5703,
      totalSpots: 130,
      pricePerHour: 45,
      amenities: {
        security: true,
        cctv: true,
        covered: false,
        metroAccess: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Bannerghatta Road Parking',
      address: 'Bannerghatta Road',
      city: 'Bangalore',
      latitude: 12.8969,
      longitude: 77.5967,
      totalSpots: 110,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Yelahanka New Town Parking',
      address: 'Yelahanka',
      city: 'Bangalore',
      latitude: 13.1007,
      longitude: 77.5963,
      totalSpots: 95,
      pricePerHour: 35,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Cubbon Park Parking',
      address: 'Cubbon Park Road',
      city: 'Bangalore',
      latitude: 12.9762,
      longitude: 77.5929,
      totalSpots: 140,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Marathahalli ORR Parking',
      address: 'Marathahalli, Outer Ring Road',
      city: 'Bangalore',
      latitude: 12.9591,
      longitude: 77.6974,
      totalSpots: 200,
      pricePerHour: 55,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Yeshwanthpur Metro Parking',
      address: 'Yeshwanthpur',
      city: 'Bangalore',
      latitude: 13.0281,
      longitude: 77.5387,
      totalSpots: 170,
      pricePerHour: 45,
      amenities: {
        security: true,
        cctv: true,
        covered: false,
        metroAccess: true,
      },
      ownerId: parkingOwner1.id,
    },

    // Pune - 8 parking lots
    {
      name: 'Shivaji Nagar Parking Plaza',
      address: 'Shivaji Nagar',
      city: 'Pune',
      latitude: 18.5304,
      longitude: 73.8567,
      totalSpots: 120,
      pricePerHour: 45,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Koregaon Park Parking',
      address: 'Koregaon Park',
      city: 'Pune',
      latitude: 18.5362,
      longitude: 73.8932,
      totalSpots: 90,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Hinjewadi IT Park Parking',
      address: 'Hinjewadi Phase 1',
      city: 'Pune',
      latitude: 18.5912,
      longitude: 73.7389,
      totalSpots: 400,
      pricePerHour: 40,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        evCharging: true,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'FC Road Shopping District',
      address: 'Fergusson College Road',
      city: 'Pune',
      latitude: 18.5196,
      longitude: 73.8354,
      totalSpots: 80,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Baner Balewadi High Street',
      address: 'Baner',
      city: 'Pune',
      latitude: 18.5593,
      longitude: 73.7817,
      totalSpots: 150,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Viman Nagar Airport Road',
      address: 'Viman Nagar',
      city: 'Pune',
      latitude: 18.5679,
      longitude: 73.9143,
      totalSpots: 110,
      pricePerHour: 55,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Magarpatta City Parking',
      address: 'Magarpatta, Hadapsar',
      city: 'Pune',
      latitude: 18.5157,
      longitude: 73.9288,
      totalSpots: 250,
      pricePerHour: 60,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        valet: true,
        evCharging: true,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Kothrud Depot Parking',
      address: 'Kothrud',
      city: 'Pune',
      latitude: 18.5074,
      longitude: 73.8077,
      totalSpots: 100,
      pricePerHour: 35,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },

    // Chennai - 10 parking lots
    {
      name: 'T Nagar Shopping District',
      address: 'T Nagar, Pondy Bazaar',
      city: 'Chennai',
      latitude: 13.0418,
      longitude: 80.2341,
      totalSpots: 150,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Anna Nagar Parking Hub',
      address: 'Anna Nagar West',
      city: 'Chennai',
      latitude: 13.085,
      longitude: 80.2101,
      totalSpots: 120,
      pricePerHour: 45,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'OMR IT Corridor Parking',
      address: 'Old Mahabalipuram Road, Thoraipakkam',
      city: 'Chennai',
      latitude: 12.9388,
      longitude: 80.2305,
      totalSpots: 300,
      pricePerHour: 55,
      amenities: {
        security: true,
        cctv: true,
        covered: true,
        evCharging: true,
      },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Marina Beach Parking',
      address: 'Marina Beach Road',
      city: 'Chennai',
      latitude: 13.0499,
      longitude: 80.2824,
      totalSpots: 200,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Velachery Main Road Parking',
      address: 'Velachery',
      city: 'Chennai',
      latitude: 12.975,
      longitude: 80.221,
      totalSpots: 110,
      pricePerHour: 40,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Porur Metro Parking',
      address: 'Porur',
      city: 'Chennai',
      latitude: 13.0358,
      longitude: 80.156,
      totalSpots: 180,
      pricePerHour: 45,
      amenities: {
        security: true,
        cctv: true,
        covered: false,
        metroAccess: true,
      },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Adyar Parking Complex',
      address: 'Adyar',
      city: 'Chennai',
      latitude: 13.0067,
      longitude: 80.2575,
      totalSpots: 95,
      pricePerHour: 50,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Tambaram Railway Station',
      address: 'Tambaram',
      city: 'Chennai',
      latitude: 12.9249,
      longitude: 80.1,
      totalSpots: 160,
      pricePerHour: 30,
      amenities: { security: true, cctv: true, covered: false },
      ownerId: parkingOwner2.id,
    },
    {
      name: 'Guindy Industrial Estate',
      address: 'Guindy',
      city: 'Chennai',
      latitude: 13.0097,
      longitude: 80.2209,
      totalSpots: 140,
      pricePerHour: 45,
      amenities: { security: true, cctv: true, covered: true },
      ownerId: parkingOwner1.id,
    },
    {
      name: 'Mylapore Temple Parking',
      address: 'Mylapore',
      city: 'Chennai',
      latitude: 13.0339,
      longitude: 80.2619,
      totalSpots: 70,
      pricePerHour: 35,
      amenities: { security: true, cctv: false, covered: false },
      ownerId: parkingOwner2.id,
    },
  ]

  console.log('🅿️  Creating parking lots and spots...')

  for (const lotData of parkingLotsData) {
    const parkingLot = await prisma.parkingLot.create({
      data: lotData,
    })

    // Create parking spots for each lot
    const spotsPerLot = lotData.totalSpots
    const twoWheelerSpots = Math.floor(spotsPerLot * 0.4) // 40% two-wheelers
    const fourWheelerSpots = Math.floor(spotsPerLot * 0.5) // 50% four-wheelers
    const disabledSpots = Math.floor(spotsPerLot * 0.05) // 5% disabled
    const evSpots =
      spotsPerLot - twoWheelerSpots - fourWheelerSpots - disabledSpots // Remaining for EV

    const spots = []

    // Create two-wheeler spots
    for (let i = 1; i <= twoWheelerSpots; i++) {
      spots.push({
        spotNumber: `2W-${i}`,
        type: VehicleType.TWO_WHEELER,
        status:
          Math.random() > 0.3 ? SpotStatus.AVAILABLE : SpotStatus.OCCUPIED,
        parkingLotId: parkingLot.id,
      })
    }

    // Create four-wheeler spots
    for (let i = 1; i <= fourWheelerSpots; i++) {
      spots.push({
        spotNumber: `4W-${i}`,
        type: VehicleType.FOUR_WHEELER,
        status:
          Math.random() > 0.4 ? SpotStatus.AVAILABLE : SpotStatus.OCCUPIED,
        parkingLotId: parkingLot.id,
      })
    }

    // Create disabled spots
    for (let i = 1; i <= disabledSpots; i++) {
      spots.push({
        spotNumber: `DIS-${i}`,
        type: VehicleType.DISABLED,
        status:
          Math.random() > 0.8 ? SpotStatus.AVAILABLE : SpotStatus.OCCUPIED,
        parkingLotId: parkingLot.id,
      })
    }

    // Create EV charging spots
    for (let i = 1; i <= evSpots; i++) {
      spots.push({
        spotNumber: `EV-${i}`,
        type: VehicleType.EV_CHARGING,
        status:
          Math.random() > 0.5 ? SpotStatus.AVAILABLE : SpotStatus.OCCUPIED,
        parkingLotId: parkingLot.id,
      })
    }

    await prisma.parkingSpot.createMany({
      data: spots,
    })

    // Create sensors for random spots (30% of spots have sensors)
    const createdSpots = await prisma.parkingSpot.findMany({
      where: { parkingLotId: parkingLot.id },
    })

    const spotsWithSensors = createdSpots.filter(() => Math.random() > 0.7)

    for (const spot of spotsWithSensors) {
      const sensorTypes = [
        SensorType.ULTRASONIC,
        SensorType.CAMERA,
        SensorType.MAGNETIC,
      ]
      const randomSensorType =
        sensorTypes[Math.floor(Math.random() * sensorTypes.length)]

      await prisma.sensor.create({
        data: {
          parkingSpotId: spot.id,
          sensorType: randomSensorType,
          lastPing: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
          batteryLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
        },
      })
    }

    console.log(`✅ Created ${parkingLot.name} with ${spots.length} spots`)
  }

  // Create some sample reports
  console.log('📝 Creating sample crowd-sourced reports...')
  const allParkingLots = await prisma.parkingLot.findMany()

  for (let i = 0; i < 20; i++) {
    const randomLot =
      allParkingLots[Math.floor(Math.random() * allParkingLots.length)]
    const reportTypes = ['AVAILABILITY', 'ISSUE', 'PRICING', 'AMENITY']
    const randomType =
      reportTypes[Math.floor(Math.random() * reportTypes.length)]

    await prisma.report.create({
      data: {
        userId: regularUser.id,
        parkingLotId: randomLot.id,
        reportType: randomType as any,
        description: `Sample ${randomType.toLowerCase()} report for ${randomLot.name}`,
      },
    })
  }

  console.log('✅ Created 20 sample reports')

  // Summary
  const totalUsers = await prisma.user.count()
  const totalParkingLots = await prisma.parkingLot.count()
  const totalSpots = await prisma.parkingSpot.count()
  const totalSensors = await prisma.sensor.count()
  const totalReports = await prisma.report.count()

  console.log('\n🎉 Database seeding completed!')
  console.log('📊 Summary:')
  console.log(`   - Users: ${totalUsers}`)
  console.log(`   - Parking Lots: ${totalParkingLots}`)
  console.log(`   - Parking Spots: ${totalSpots}`)
  console.log(`   - IoT Sensors: ${totalSensors}`)
  console.log(`   - Reports: ${totalReports}`)
  console.log('\n🏙️  Cities covered:')
  console.log('   - Mumbai: 15 parking lots')
  console.log('   - Delhi: 12 parking lots')
  console.log('   - Bangalore: 13 parking lots')
  console.log('   - Pune: 8 parking lots')
  console.log('   - Chennai: 10 parking lots')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
