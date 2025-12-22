import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Loader2, Plane, Hotel, AlertCircle } from 'lucide-react';
import { bookingsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BookingCard, { Booking } from '@/components/cards/BookingCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthModal from '@/components/auth/AuthModal';

const Bookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        fetchBookings();
      } else {
        setAuthModalOpen(true);
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, authLoading]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      const raw = response.data.bookings || response.data || [];

      // Map backend booking shape to frontend `Booking` shape
      const mapped: Booking[] = raw.map((b: any) => {
        const base: Booking = {
          _id: b._id,
          type: (b.bookingType || b.type) === 'hotel' ? 'hotel' : 'flight',
          status: b.status || 'confirmed',
          createdAt: b.bookingDate || b.createdAt || new Date().toISOString(),
          details: {} as any,
        } as Booking;

        if ((b.bookingType || b.type) === 'flight') {
          const f = b.flightId || b.flight;
          base.details = {
            airline: f?.airline,
            flightNumber: f?.flightNumber,
            from: f?.from,
            to: f?.to,
            departureDate: b.travelDate ? new Date(b.travelDate).toLocaleDateString() : undefined,
            price: b.totalPrice || f?.price,
          };
        } else {
          const h = b.hotelId || b.hotel;
          base.details = {
            hotelName: h?.name,
            location: h?.location,
            checkIn: b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : undefined,
            checkOut: b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString() : undefined,
            price: b.totalPrice || h?.pricePerNight,
          };
        }

        return base;
      });

      setBookings(mapped);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await bookingsAPI.cancel(id);
      setBookings(bookings.map((b) =>
        b._id === id ? { ...b, status: 'cancelled' as const } : b
      ));
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel booking.',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'flights') return booking.type === 'flight';
    if (activeTab === 'hotels') return booking.type === 'hotel';
    return true;
  });

  const stats = {
    total: bookings.length,
    flights: bookings.filter((b) => b.type === 'flight').length,
    hotels: bookings.filter((b) => b.type === 'hotel').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
  };

  if (authLoading || (!isAuthenticated && !authModalOpen)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage all your travel reservations in one place
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Bookings', value: stats.total, icon: Calendar },
            { label: 'Flights', value: stats.flights, icon: Plane },
            { label: 'Hotels', value: stats.hotels, icon: Hotel },
            { label: 'Confirmed', value: stats.confirmed, icon: AlertCircle },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-4 shadow-soft border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs & Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="flights">Flights</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Loading your bookings...</p>
                </div>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BookingCard
                      booking={booking}
                      onCancel={handleCancel}
                      isCancelling={cancellingId === booking._id}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20">
                  <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start planning your next adventure!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="hero" onClick={() => navigate('/flights')}>
                      <Plane className="w-4 h-4" />
                      Search Flights
                    </Button>
                    <Button variant="ocean" onClick={() => navigate('/hotels')}>
                      <Hotel className="w-4 h-4" />
                      Find Hotels
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (!isAuthenticated) {
            navigate('/');
          }
        }}
        mode="login"
        onModeChange={() => {}}
      />
    </main>
  );
};

export default Bookings;
