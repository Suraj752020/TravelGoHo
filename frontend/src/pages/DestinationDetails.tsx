import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Plane, Hotel, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import CheckoutModal from '@/components/booking/CheckoutModal';

// Mock Data Database
const destinationsData: Record<string, any> = {
    'Bali': {
        description: "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple.",
        bestTime: "April to October",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000",
        hotels: [
            { _id: "mock_hotel_bali_1", location: "Bali", name: "Komaneka at Bisma", rating: 4.9, price: 150, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_bali_2", location: "Bali", name: "The Kayon Resort", rating: 4.8, price: 200, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_bali_3", location: "Bali", name: "Padma Resort Ubud", rating: 4.7, price: 180, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400" }
        ],
        flights: [
            { from: "Jakarta", price: 100, airline: "Garuda Indonesia" },
            { from: "Singapore", price: 150, airline: "Singapore Airlines" },
            { from: "Sydney", price: 400, airline: "Qantas" }
        ]
    },
    'Paris': {
        description: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.",
        bestTime: "June to August and September to October",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000",
        hotels: [
            { _id: "mock_hotel_paris_1", location: "Paris", name: "Hotel Ritz Paris", rating: 5.0, price: 1200, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_paris_2", location: "Paris", name: "The Peninsula Paris", rating: 4.9, price: 900, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_paris_3", location: "Paris", name: "Shangri-La Paris", rating: 4.8, price: 850, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=400" }
        ],
        flights: [
            { from: "New York", price: 600, airline: "Air France" },
            { from: "London", price: 80, airline: "British Airways" },
            { from: "Dubai", price: 500, airline: "Emirates" }
        ]
    },
    'Tokyo': {
        description: "Tokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods.",
        bestTime: "March to May and September to November",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1000",
        hotels: [
            { _id: "mock_hotel_tokyo_1", location: "Tokyo", name: "Aman Tokyo", rating: 4.9, price: 1000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_tokyo_2", location: "Tokyo", name: "Hoshinoya Tokyo", rating: 4.8, price: 800, image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_tokyo_3", location: "Tokyo", name: "Park Hyatt", rating: 4.7, price: 700, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400" }
        ],
        flights: [
            { from: "Los Angeles", price: 800, airline: "JAL" },
            { from: "Seoul", price: 200, airline: "Korean Air" },
            { from: "Bangkok", price: 350, airline: "Thai Airways" }
        ]
    },
    'Santorini': {
        description: "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape.",
        bestTime: "September to October",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1000",
        hotels: [
            { _id: "mock_hotel_santorini_1", location: "Santorini", name: "Canaves Oia", rating: 4.9, price: 600, image: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_santorini_2", location: "Santorini", name: "Mystique", rating: 4.8, price: 550, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_santorini_3", location: "Santorini", name: "Andronis Luxury Suites", rating: 4.9, price: 700, image: "https://images.unsplash.com/photo-1571896349842-6e53ce41e86a?auto=format&fit=crop&q=80&w=400" }
        ],
        flights: [
            { from: "Athens", price: 100, airline: "Aegean Airlines" },
            { from: "Rome", price: 150, airline: "Ryanair" },
            { from: "London", price: 200, airline: "EasyJet" }
        ]
    },
    'Maldives': {
        description: "The Maldives is a tropical nation in the Indian Ocean known for its beaches, blue lagoons and extensive reefs. It's the ultimate honeymoon destination with overwater bungalows.",
        bestTime: "November to April",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1000",
        hotels: [
            { _id: "mock_hotel_maldives_1", location: "Maldives", name: "Soneva Jani", rating: 5.0, price: 2000, image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_maldives_2", location: "Maldives", name: "Gili Lankanfushi", rating: 4.9, price: 1800, image: "https://images.unsplash.com/photo-1540280419819-32c1c6a85ea4?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_maldives_3", location: "Maldives", name: "Six Senses Laamu", rating: 4.9, price: 1500, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=400" }
        ],
        flights: [
            { from: "Dubai", price: 400, airline: "Emirates" },
            { from: "Male", price: 100, airline: "Maldivian" },
            { from: "Colombo", price: 150, airline: "SriLankan Airlines" }
        ]
    },
    'Goa': {
        description: "Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony prior to 1961 is evident in its preserved 17th-century churches and the area’s tropical spice plantations.",
        bestTime: "November to February",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000",
        hotels: [
            { _id: "mock_hotel_goa_1", location: "Goa", name: "Taj Exotica", rating: 4.8, price: 300, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_goa_2", location: "Goa", name: "W Goa", rating: 4.7, price: 250, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_goa_3", location: "Goa", name: "Hard Rock Hotel", rating: 4.5, price: 150, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400" }
        ],
        flights: [
            { from: "Mumbai", price: 50, airline: "IndiGo" },
            { from: "Delhi", price: 100, airline: "Vistara" },
            { from: "Bangalore", price: 60, airline: "AirAsia" }
        ]
    },
    'Manali': {
        description: "Manali is a high-altitude Himalayan resort town in India’s northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination.",
        bestTime: "October to June",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000",
        hotels: [
            { _id: "mock_hotel_manali_1", location: "Manali", name: "The Anantmaya", rating: 4.6, price: 100, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_manali_2", location: "Manali", name: "Span Resort", rating: 4.8, price: 200, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400" },
            { _id: "mock_hotel_manali_3", location: "Manali", name: "Solang Valley Resort", rating: 4.5, price: 120, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400" }
        ],
        flights: [
            { from: "Delhi", price: 80, airline: "Alliance Air" },
            { from: "Chandigarh", price: 50, airline: "Himalayan Heli" },
            { from: "Kullu", price: 40, airline: "Air India" }
        ]
    }
};

const DestinationDetails = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const data = destinationsData[name || 'Bali'] || destinationsData['Bali'];

    // Booking State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);

    const handleBookHotel = (hotel: any) => {
        // Create mock booking details since we don't have a date picker on this page
        // Default to: Check-in Tomorrow, Check-out 4 days later (3 nights)
        const today = new Date();
        const checkInDate = new Date(today);
        checkInDate.setDate(today.getDate() + 1);

        const checkOutDate = new Date(today);
        checkOutDate.setDate(today.getDate() + 4);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const bookingDetails = {
            ...hotel,
            checkIn: formatDate(checkInDate),
            checkOut: formatDate(checkOutDate),
            numberOfRooms: 1,
            guests: 2
        };

        setSelectedHotel(bookingDetails);
        setIsCheckoutOpen(true);
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img src={data.image} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute top-0 left-0 p-4">
                    <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="gap-2 backdrop-blur-md bg-background/50 text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </div>
                <div className="absolute bottom-0 left-0 p-8 container mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-bold text-foreground mb-4"
                    >
                        {name}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2 text-foreground/80"
                    >
                        <MapPin className="w-5 h-5" />
                        <span className="text-xl">Popular Destination</span>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 space-y-16">

                {/* About Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-3xl font-bold font-display">About {name}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {data.description}
                        </p>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm h-fit">
                        <h3 className="flex items-center gap-2 font-semibold mb-3 text-primary">
                            <Calendar className="w-5 h-5" />
                            Best Time to Visit
                        </h3>
                        <p className="text-foreground font-medium">{data.bestTime}</p>
                    </div>
                </motion.section>

                {/* Top Hotels */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">Top Hotels</h2>
                            <p className="text-muted-foreground">Stay at the finest places in {name}</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(`/hotels?location=${name}`)}>
                            See All Hotels <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {data.hotels.map((hotel: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-card rounded-xl overflow-hidden border border-border/50 shadow-soft hover:shadow-lg transition-all"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg">{hotel.name}</h3>
                                        <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            {hotel.rating}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Starting from <span className="text-lg font-bold text-foreground">${hotel.price}</span>/night
                                        </div>
                                        <Button size="sm" variant="default" onClick={() => handleBookHotel(hotel)}>
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Popular Flights */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">Popular Flights</h2>
                            <p className="text-muted-foreground">Best flight deals to {name}</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate(`/flights?to=${name}`)}>
                            Find Flights <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {data.flights.map((flight: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card p-6 rounded-xl border border-border/50 shadow-soft flex flex-col justify-between group hover:border-primary/50 transition-colors"
                                onClick={() => navigate(`/flights?to=${name}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                        <Plane className="w-5 h-5" />
                                    </div>
                                    <Badge variant="secondary">Direct</Badge>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                        From
                                    </div>
                                    <div className="text-lg font-bold">{flight.from}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{flight.airline}</div>
                                </div>

                                <div className="pt-4 border-t border-dashed flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">One Way</p>
                                        <p className="text-xl font-bold text-primary">${flight.price}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                bookingDetails={selectedHotel}
                type="hotel"
            />
        </main>
    );
};

export default DestinationDetails;
