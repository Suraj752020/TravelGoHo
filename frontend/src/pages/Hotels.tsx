import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hotel, Search, Calendar, Users, MapPin, Loader2, Filter, Grid, List } from 'lucide-react';
import { hotelsAPI, bookingsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import HotelCard, { Hotel as HotelType } from '@/components/cards/HotelCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthModal from '@/components/auth/AuthModal';
import CheckoutModal from '@/components/booking/CheckoutModal';

const Hotels = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchForm, setSearchForm] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
  });

  useEffect(() => {
    if (searchParams.get('location')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const response = await hotelsAPI.search(searchForm);
      setHotels(response.data.hotels || response.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch hotels. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (hotel: HotelType) => {
    if (!isAuthenticated) {
      setSelectedHotel(hotel);
      setAuthModalOpen(true);
      return;
    }
    setSelectedHotel(hotel);
    // Open payment modal
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Find Your Perfect Stay
          </h1>
          <p className="text-muted-foreground">
            Discover amazing hotels, resorts, and vacation rentals
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border/50 mb-8"
        >
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2 lg:col-span-1">
                <Label>Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Where are you going?"
                    className="pl-10"
                    value={searchForm.location}
                    onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Check-in</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={searchForm.checkIn}
                    onChange={(e) => setSearchForm({ ...searchForm, checkIn: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Check-out</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={searchForm.checkOut}
                    onChange={(e) => setSearchForm({ ...searchForm, checkOut: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    className="pl-10"
                    value={searchForm.guests || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSearchForm({ ...searchForm, guests: isNaN(val) ? 0 : val });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="hero" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search Hotels
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Searching for the best hotels...</p>
            </div>
          ) : hotels.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{hotels.length}</span> hotels found
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {hotels.map((hotel, index) => (
                  <motion.div
                    key={hotel._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <HotelCard hotel={hotel} onBook={handleBook} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : searchParams.get('location') ? (
            <div className="text-center py-20">
              <Hotel className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No hotels found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or dates.
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <Hotel className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Search</h3>
              <p className="text-muted-foreground">
                Enter your destination above to find available hotels.
              </p>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (selectedHotel && isAuthenticated) {
            handleBook(selectedHotel);
          }
        }}
        mode="login"
        onModeChange={() => { }}
      />

      <CheckoutModal
        isOpen={!!selectedHotel && !authModalOpen}
        onClose={() => setSelectedHotel(null)}
        bookingDetails={selectedHotel ? {
          ...selectedHotel,
          ...searchForm,
          name: selectedHotel.name
        } : {}}
        type="hotel"
      />
    </main>
  );
};

export default Hotels;
