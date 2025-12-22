import { motion } from 'framer-motion';
import { Plane, Hotel, Calendar, MapPin, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface Booking {
  _id: string;
  type: 'flight' | 'hotel';
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  details: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    location?: string;
    checkIn?: string;
    checkOut?: string;
    hotelName?: string;
    airline?: string;
    flightNumber?: string;
    price?: number;
  };
}

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
  isCancelling?: boolean;
}

const statusStyles = {
  confirmed: 'bg-palm/20 text-palm border-palm/30',
  pending: 'bg-accent/20 text-accent border-accent/30',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

const BookingCard = ({ booking, onCancel, isCancelling }: BookingCardProps) => {
  const isHotel = booking.type === 'hotel';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Type Icon & Details */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isHotel ? 'gradient-ocean' : 'gradient-sunset'}`}>
            {isHotel ? (
              <Hotel className="w-6 h-6 text-secondary-foreground" />
            ) : (
              <Plane className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">
                {isHotel ? booking.details.hotelName : `${booking.details.airline} ${booking.details.flightNumber}`}
              </h3>
              <Badge className={statusStyles[booking.status]}>
                {booking.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {isHotel ? booking.details.location : `${booking.details.from} → ${booking.details.to}`}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {isHotel
                  ? `${booking.details.checkIn} - ${booking.details.checkOut}`
                  : booking.details.departureDate}
              </div>
            </div>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center gap-4">
          {booking.details.price && (
            <div className="text-right">
              <p className="text-xl font-bold text-gradient-sunset">${booking.details.price}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          )}
          {booking.status !== 'cancelled' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(booking._id)}
              disabled={isCancelling}
              className="text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              {isCancelling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Cancel
                </>
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={() => window.location.href = `/booking-success/${booking._id}`}
          >
            View Receipt
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
