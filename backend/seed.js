// ============================================
// FILE: seed.js (Run this to add sample data)
// ============================================
const mongoose = require('mongoose');
const Flight = require('./models/Flight');
const Hotel = require('./models/Hotel');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/travelgoHo')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection Error:', err));

// Sample Flights Data
const flightsData = [
  {
    airline: 'Air India',
    flightNumber: 'AI-101',
    from: 'Delhi',
    to: 'Mumbai',
    departureTime: '06:00 AM',
    arrivalTime: '08:15 AM',
    duration: '2h 15m',
    price: 5500,
    availableSeats: 100
  },
  {
    airline: 'IndiGo',
    flightNumber: '6E-202',
    from: 'Delhi',
    to: 'Mumbai',
    departureTime: '10:30 AM',
    arrivalTime: '12:45 PM',
    duration: '2h 15m',
    price: 4200,
    availableSeats: 150
  },
  {
    airline: 'SpiceJet',
    flightNumber: 'SG-303',
    from: 'Delhi',
    to: 'Bangalore',
    departureTime: '09:00 AM',
    arrivalTime: '11:45 AM',
    duration: '2h 45m',
    price: 6800,
    availableSeats: 120
  },
  {
    airline: 'Vistara',
    flightNumber: 'UK-404',
    from: 'Mumbai',
    to: 'Bangalore',
    departureTime: '14:30 PM',
    arrivalTime: '16:00 PM',
    duration: '1h 30m',
    price: 4500,
    availableSeats: 80
  },
  {
    airline: 'Air India',
    flightNumber: 'AI-505',
    from: 'Delhi',
    to: 'Goa',
    departureTime: '07:15 AM',
    arrivalTime: '10:00 AM',
    duration: '2h 45m',
    price: 7200,
    availableSeats: 90
  },
  {
    airline: 'IndiGo',
    flightNumber: '6E-606',
    from: 'Mumbai',
    to: 'Goa',
    departureTime: '11:00 AM',
    arrivalTime: '12:30 PM',
    duration: '1h 30m',
    price: 3800,
    availableSeats: 110
  },
  {
    airline: 'Air Asia',
    flightNumber: 'I5-707',
    from: 'Bangalore',
    to: 'Chennai',
    departureTime: '16:00 PM',
    arrivalTime: '17:00 PM',
    duration: '1h 00m',
    price: 3200,
    availableSeats: 100
  },
  {
    airline: 'SpiceJet',
    flightNumber: 'SG-808',
    from: 'Delhi',
    to: 'Chennai',
    departureTime: '05:30 AM',
    arrivalTime: '08:15 AM',
    duration: '2h 45m',
    price: 6500,
    availableSeats: 95
  }
];

// Sample Hotels Data
const hotelsData = [
  {
    name: 'Taj Palace Hotel',
    location: 'Mumbai',
    address: 'Colaba, Mumbai, Maharashtra',
    pricePerNight: 8500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    amenities: ['Swimming Pool', 'Spa', 'WiFi', 'Restaurant', 'Bar', 'Gym'],
    availableRooms: 50,
    description: 'Luxury 5-star hotel with stunning sea views'
  },
  {
    name: 'The Oberoi',
    location: 'Mumbai',
    address: 'Nariman Point, Mumbai, Maharashtra',
    pricePerNight: 9500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Business Center'],
    availableRooms: 40,
    description: 'Premier luxury hotel in South Mumbai'
  },
  {
    name: 'Beach Paradise Resort',
    location: 'Goa',
    address: 'Calangute Beach, North Goa',
    pricePerNight: 6000,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    amenities: ['Beach Access', 'Pool', 'WiFi', 'Restaurant', 'Water Sports'],
    availableRooms: 60,
    description: 'Beautiful beachfront resort with private beach access'
  },
  {
    name: 'Goa Marriott Resort',
    location: 'Goa',
    address: 'Panjim, Goa',
    pricePerNight: 7500,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Beach Access', 'Bar'],
    availableRooms: 45,
    description: 'Luxury resort with world-class amenities'
  },
  {
    name: 'ITC Grand Chola',
    location: 'Chennai',
    address: 'Guindy, Chennai, Tamil Nadu',
    pricePerNight: 9000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    amenities: ['Pool', 'Spa', 'WiFi', 'Multiple Restaurants', 'Gym', 'Business Center'],
    availableRooms: 55,
    description: 'Grand luxury hotel inspired by Chola architecture'
  },
  {
    name: 'The Leela Palace',
    location: 'Bangalore',
    address: 'Old Airport Road, Bangalore, Karnataka',
    pricePerNight: 8800,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Gym', 'Garden'],
    availableRooms: 48,
    description: 'Elegant palace-style luxury hotel'
  },
  {
    name: 'City Business Hotel',
    location: 'Bangalore',
    address: 'MG Road, Bangalore, Karnataka',
    pricePerNight: 4500,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
    amenities: ['WiFi', 'Restaurant', 'Gym', 'Business Center'],
    availableRooms: 70,
    description: 'Modern business hotel in the heart of the city'
  },
  {
    name: 'Grand Plaza Hotel',
    location: 'Delhi',
    address: 'Connaught Place, New Delhi',
    pricePerNight: 7000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=800',
    amenities: ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Gym', 'Parking'],
    availableRooms: 65,
    description: 'Premium hotel in central Delhi'
  },
  {
    name: 'The Imperial',
    location: 'Delhi',
    address: 'Janpath, New Delhi',
    pricePerNight: 10000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    amenities: ['Pool', 'Spa', 'WiFi', 'Fine Dining', 'Bar', 'Heritage Building'],
    availableRooms: 35,
    description: 'Historic luxury hotel with colonial architecture'
  },
  {
    name: 'Budget Inn Chennai',
    location: 'Chennai',
    address: 'T Nagar, Chennai, Tamil Nadu',
    pricePerNight: 2500,
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    amenities: ['WiFi', 'Restaurant', 'Parking'],
    availableRooms: 80,
    description: 'Comfortable budget hotel for travelers'
  }
];

// Function to seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Flight.deleteMany({});
    await Hotel.deleteMany({});

    // Insert flights
    console.log('✈️  Adding flights...');
    const flights = await Flight.insertMany(flightsData);
    console.log(`✅ ${flights.length} flights added`);

    // Insert hotels
    console.log('🏨 Adding hotels...');
    const hotels = await Hotel.insertMany(hotelsData);
    console.log(`✅ ${hotels.length} hotels added`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Flights: ${flights.length}`);
    console.log(`   Hotels: ${hotels.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();