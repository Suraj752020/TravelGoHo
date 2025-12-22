import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Calendar, Users, MapPin, Plane } from "lucide-react";
import { useState } from "react";
import { paymentAPI, bookingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingDetails: any; // Using any for flexibility with both Hotel and Flight details
    type: 'flight' | 'hotel';
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

const CheckoutModal = ({ isOpen, onClose, bookingDetails, type }: CheckoutModalProps) => {
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    // New state for mock payment UI
    const [showMockUI, setShowMockUI] = useState(false);
    const [mockProcessing, setMockProcessing] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Calculate total amount
    const calculateTotal = () => {
        if (!bookingDetails) return 0;

        if (type === 'flight') {
            const price = Number(bookingDetails.price || 0);
            const passengers = Number(bookingDetails.passengers || 1);
            return price * passengers;
        } else {
            const price = Number(bookingDetails.pricePerNight || bookingDetails.price || 0);
            const checkIn = new Date(bookingDetails.checkIn);
            const checkOut = new Date(bookingDetails.checkOut);

            // Handle invalid dates
            if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) return price;

            const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
            const rooms = Number(bookingDetails.numberOfRooms || 1);
            return price * nights * rooms;
        }
    };

    const totalAmount = calculateTotal();

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create Order
            const { data: orderData } = await paymentAPI.createOrder(totalAmount);


            if (!orderData.success) {
                throw new Error('Failed to create payment order');
            }


            // 2. Check for Mock Mode
            if (orderData.isMock) {
                setLoading(false);
                setShowMockUI(true);
                toast({
                    title: "Debug: Mock Mode Activated",
                    description: "Switching to Test Payment Screen...",
                });
                return;
            }


            // 3. Initialize Razorpay (Real Mode)
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "TravelGo",
                description: `Booking for ${type === 'flight' ? bookingDetails.from + ' to ' + bookingDetails.to : bookingDetails.name}`,
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        // 4. Create Booking
                        const bookingData = {
                            type,
                            itemId: bookingDetails._id,
                            details: {
                                ...bookingDetails,
                                // Add payment info if needed
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                            }
                        };

                        const res = await bookingsAPI.create(bookingData);

                        toast({
                            title: "Booking Confirmed!",
                            description: "Your payment was successful and booking is confirmed.",
                        });
                        onClose();
                        const newBookingId = res.data.flightBooking?._id || res.data.hotelBooking?._id || res.data._id || res.data.booking?._id;
                        if (newBookingId) {
                            navigate(`/booking-success/${newBookingId}`);
                        } else {
                            navigate('/bookings');
                        }

                    } catch (err: any) {
                        console.error(err);
                        toast({
                            title: "Booking Failed",
                            description: err.response?.data?.message || "Payment succeeded but booking failed.",
                            variant: "destructive"
                        });
                    }
                },
                prefill: {
                    name: "User Name", // You could get this from AuthContext
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#0F172A"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast({
                    title: "Payment Failed",
                    description: response.error.description,
                    variant: "destructive"
                });
                setLoading(false);
            });
            rzp1.open();

        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong initiating payment.",
                variant: "destructive"
            });
            setLoading(false);
        }
    };

    const handleMockSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMockProcessing(true);

        // Simulate network delay
        setTimeout(async () => {
            try {
                const bookingData = {
                    type,
                    itemId: bookingDetails._id,
                    details: {
                        ...bookingDetails,
                        paymentId: `pay_mock_${Date.now()}`,
                        orderId: `order_mock_${Date.now()}`,
                    }
                };
                await bookingsAPI.create(bookingData);
                toast({
                    title: "Payment Successful!",
                    description: "Your booking has been confirmed.",
                });
                onClose();
                navigate('/bookings');
            } catch (err: any) {
                toast({
                    title: "Booking Failed",
                    description: err.response?.data?.message,
                    variant: "destructive"
                });
                setMockProcessing(false);
            }
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{showMockUI ? "Complete Payment" : "Confirm Booking"}</DialogTitle>
                </DialogHeader>

                {showMockUI ? (
                    <form onSubmit={handleMockSubmit} className="py-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Test Payment Mode</h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    This is a simulated payment screen because Test Keys are not configured. No actual money will be deducted.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Card Number</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="0000 0000 0000 0000"
                                    value="4242 4242 4242 4242"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Expiry</Label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value="12/29"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>CVV</Label>
                                <input
                                    type="password"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value="123"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setShowMockUI(false)} disabled={mockProcessing}>
                                Back
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" disabled={mockProcessing}>
                                {mockProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    `Pay ₹${totalAmount.toLocaleString()}`
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="grid gap-4 py-4">
                            {/* ... (Existing Summary UI) ... */}
                            <div className="bg-muted/30 p-4 rounded-lg space-y-3 border border-border/50">
                                {bookingDetails.image && (
                                    <div className="w-full h-32 rounded-md overflow-hidden mb-3">
                                        <img
                                            src={bookingDetails.image}
                                            alt={bookingDetails.name || "Booking Item"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                                    {type === 'flight' ? <Plane className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                                    {type === 'flight' ? `${bookingDetails.from} → ${bookingDetails.to}` : bookingDetails.name}
                                </h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {type === 'flight' ? (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider">Date</span>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    <span>{bookingDetails.departureDate}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider">Passengers</span>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    <span>{bookingDetails.passengers || 1} Person(s)</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider">Dates</span>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    <span>{bookingDetails.checkIn} - {bookingDetails.checkOut}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider">Details</span>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    <span>{bookingDetails.guests || 1} Guests, {bookingDetails.numberOfRooms || 1} Room(s)</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-dashed">
                                    <p className="text-xs text-muted-foreground">
                                        Free cancellation up to 24 hours before the trip.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 py-2">
                                <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
                                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I agree to the <span className="text-primary hover:underline cursor-pointer">Terms & Conditions</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                                </Label>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Total Amount</span>
                                    <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button onClick={handlePayment} disabled={loading || !acceptedTerms} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Pay & Book
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutModal;
