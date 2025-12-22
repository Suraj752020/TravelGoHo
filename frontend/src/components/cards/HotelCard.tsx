import { motion } from 'framer-motion';
import { Star, MapPin, Wifi, Coffee, Car, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Hotel {
  _id: string;
  name: string;
  location: string;
  image?: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  amenities: string[];
  description?: string;
}

interface HotelCardProps {
  hotel: Hotel;
  onBook: (hotel: Hotel) => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  breakfast: Coffee,
  parking: Car,
  gym: Dumbbell,
};

const HotelCard = ({ hotel, onBook }: HotelCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 border border-border/50 group"
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full gradient-ocean flex items-center justify-center">
            <span className="text-4xl">🏨</span>
          </div>
        )}
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-semibold">{hotel.rating}</span>
          <span className="text-xs text-muted-foreground">({hotel.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-1">
          {hotel.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{hotel.location}</span>
        </div>

        {/* Amenities */}
        <div className="flex gap-2 mb-4">
          {hotel.amenities?.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity.toLowerCase()] || Wifi;
            return (
              <div
                key={amenity}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                title={amenity}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>

        {/* Price & Book */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-gradient-sunset">${hotel.pricePerNight}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <Button variant="hero" size="sm" onClick={() => onBook(hotel)}>
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
