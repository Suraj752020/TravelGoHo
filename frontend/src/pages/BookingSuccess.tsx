import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Download, Cloud, Sun, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const BookingSuccess = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return;
            try {
                const response = await bookingsAPI.getById(bookingId);
                setBooking(response.data.booking || response.data);

                // Show "Email Sent" toast after a short delay
                setTimeout(() => {
                    toast({
                        title: "Receipt Sent",
                        description: `A confirmation email has been sent to user@example.com`,
                    });
                }, 1000);

            } catch (error) {
                console.error("Failed to fetch booking", error);
                toast({
                    title: "Error",
                    description: "Could not load booking details.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Booking not found</h2>
                <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
        );
    }

    // Determine Destination and Date for Weather
    const destination = booking.bookingType === 'flight' ? booking.flight?.to : booking.hotel?.location;
    const date = booking.bookingType === 'flight' ? booking.flight?.departureTime : booking.hotel?.checkInDate; // Use creation date if travel date missing? No, use travel details.

    // Mock Weather Data
    const weatherMock = {
        temp: 28,
        condition: 'Sunny',
        forecast: [
            { day: 'Mon', temp: 28, icon: Sun },
            { day: 'Tue', temp: 27, icon: Cloud },
            { day: 'Wed', temp: 29, icon: Sun },
        ]
    };

    return (
        <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <Check className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
                        </motion.div>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Payment Successful!</h1>
                    <p className="text-muted-foreground">Your booking has been confirmed.</p>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        <Check className="w-3 h-3" />
                        Email confirmation sent
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Receipt Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-2 bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                            <div>
                                <h2 className="font-semibold text-lg">Booking Receipt</h2>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">ID: {booking._id}</p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: "Downloading...", description: "Receipt download started." })}>
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg">
                                        {booking.bookingType === 'flight'
                                            ? (booking.flight?.airline || booking.details?.airline) + ' Flight'
                                            : (booking.hotel?.name || booking.details?.name)}
                                    </h3>
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                        {booking.bookingType === 'flight' ? (
                                            <>
                                                <span>{booking.flight?.from || booking.details?.from}</span>
                                                <ArrowRight className="w-3 h-3" />
                                                <span>{booking.flight?.to || booking.details?.to}</span>
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="w-3 h-3" />
                                                <span>{booking.hotel?.location || booking.details?.location}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                                    <p className="text-2xl font-bold text-primary">₹{booking.totalPrice?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-dashed">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Date</p>
                                    <p className="font-medium">
                                        {new Date(booking.bookingType === 'flight' ? booking.flight?.departureTime : booking.checkInDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">
                                        {booking.bookingType === 'flight' ? 'Passengers' : 'Guests'}
                                    </p>
                                    <p className="font-medium">{booking.bookingType === 'flight' ? booking.details?.passengers || 1 : booking.numberOfGuests || 1}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-medium flex items-center gap-2">
                                    Credit Card
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    **** 4242
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Weather Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-blue-500 text-white rounded-2xl p-6 shadow-glow relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                            <Sun className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Destination Weather</h3>
                            <h2 className="text-2xl font-bold">{destination}</h2>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="text-5xl font-bold">{weatherMock.temp}°</span>
                                <div>
                                    <Sun className="w-8 h-8 mb-1" />
                                    <p className="font-medium">{weatherMock.condition}</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-6 space-y-3">
                            <p className="text-xs text-blue-100 font-medium uppercase tracking-wider">Forecast</p>
                            {weatherMock.forecast.map((day, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="w-8">{day.day}</span>
                                    <day.icon className="w-4 h-4 opacity-80" />
                                    <span className="font-medium">{day.temp}°</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/bookings')}>View My Bookings</Button>
                    <Button onClick={() => navigate('/')}>Book Another Trip</Button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
