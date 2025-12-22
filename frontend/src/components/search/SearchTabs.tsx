import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Hotel, Search, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TabType = 'flights' | 'hotels';

const SearchTabs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('flights');
  const [flightSearch, setFlightSearch] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
  });
  const [hotelSearch, setHotelSearch] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: flightSearch.from,
      to: flightSearch.to,
      departureDate: flightSearch.departureDate,
      returnDate: flightSearch.returnDate,
      passengers: flightSearch.passengers.toString(),
    });
    navigate(`/flights?${params.toString()}`);
  };

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      location: hotelSearch.location,
      checkIn: hotelSearch.checkIn,
      checkOut: hotelSearch.checkOut,
      guests: hotelSearch.guests.toString(),
    });
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'flights' as TabType, label: 'Flights', icon: Plane },
          { id: 'hotels' as TabType, label: 'Hotels', icon: Hotel },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? 'gradient-sunset text-primary-foreground shadow-lg'
                : 'glass-dark text-primary-foreground/80 hover:text-primary-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-2xl p-6 shadow-card"
      >
        {activeTab === 'flights' ? (
          <form onSubmit={handleFlightSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/80">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="City or airport"
                    className="pl-10"
                    value={flightSearch.from}
                    onChange={(e) => setFlightSearch({ ...flightSearch, from: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="City or airport"
                    className="pl-10"
                    value={flightSearch.to}
                    onChange={(e) => setFlightSearch({ ...flightSearch, to: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Departure</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={flightSearch.departureDate}
                    onChange={(e) => setFlightSearch({ ...flightSearch, departureDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Return</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={flightSearch.returnDate}
                    onChange={(e) => setFlightSearch({ ...flightSearch, returnDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Passengers:</span>
                <Input
                  type="number"
                  min="1"
                  max="9"
                  className="w-20"
                  value={flightSearch.passengers}
                  onChange={(e) => setFlightSearch({ ...flightSearch, passengers: parseInt(e.target.value) })}
                />
              </div>
              <Button type="submit" variant="hero" size="lg">
                <Search className="w-4 h-4" />
                Search Flights
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleHotelSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 lg:col-span-2">
                <Label className="text-foreground/80">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Where are you going?"
                    className="pl-10"
                    value={hotelSearch.location}
                    onChange={(e) => setHotelSearch({ ...hotelSearch, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Check-in</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={hotelSearch.checkIn}
                    onChange={(e) => setHotelSearch({ ...hotelSearch, checkIn: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/80">Check-out</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={hotelSearch.checkOut}
                    onChange={(e) => setHotelSearch({ ...hotelSearch, checkOut: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Guests:</span>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  className="w-20"
                  value={hotelSearch.guests}
                  onChange={(e) => setHotelSearch({ ...hotelSearch, guests: parseInt(e.target.value) })}
                />
              </div>
              <Button type="submit" variant="hero" size="lg">
                <Search className="w-4 h-4" />
                Search Hotels
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SearchTabs;
