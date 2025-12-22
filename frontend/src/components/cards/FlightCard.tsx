import { motion } from 'framer-motion';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Flight {
  _id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
}

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

const FlightCard = ({ flight, onBook }: FlightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border border-border/50"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Airline Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-ocean flex items-center justify-center">
            <Plane className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{flight.airline}</h3>
            <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight Times */}
        <div className="flex items-center gap-6 flex-1 justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{flight.departureTime}</p>
            <p className="text-sm text-muted-foreground">{flight.from}</p>
          </div>
          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{flight.duration}</span>
            </div>
            <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-accent relative">
              <Plane className="w-3 h-3 text-primary absolute -top-[5px] right-0" />
            </div>
            <span className="text-xs text-muted-foreground">Direct</span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{flight.arrivalTime}</p>
            <p className="text-sm text-muted-foreground">{flight.to}</p>
          </div>
        </div>

        {/* Price & Book */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-2xl font-bold text-gradient-sunset">${flight.price}</p>
            <p className="text-xs text-muted-foreground">{flight.availableSeats} seats left</p>
          </div>
          <Button variant="hero" onClick={() => onBook(flight)}>
            Book Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
