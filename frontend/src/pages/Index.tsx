import { motion } from 'framer-motion';
import { ArrowRight, Plane, Hotel, Shield, Clock, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-beach.jpg';
import SearchTabs from '@/components/search/SearchTabs';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Your payments and personal data are always protected.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for all your travel needs.',
  },
  {
    icon: HeartHandshake,
    title: 'Best Price Guarantee',
    description: 'Find a lower price? We\'ll match it instantly.',
  },
];

const destinations = [
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', price: 899 },
  { name: 'Paris', country: 'France', emoji: '🗼', price: 1299 },
  { name: 'Tokyo', country: 'Japan', emoji: '🏯', price: 1499 },
  { name: 'Santorini', country: 'Greece', emoji: '🏛️', price: 1199 },
];

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Tropical beach paradise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              Your Next Adventure
              <br />
              <span className="text-gradient-sunset">Starts Here</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Discover amazing destinations, book flights and hotels with ease,
              and create memories that last a lifetime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SearchTabs />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary-foreground rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Travel With Us?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We make travel planning simple, secure, and enjoyable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 text-center shadow-soft hover:shadow-card transition-shadow border border-border/50"
              >
                <div className="w-16 h-16 rounded-2xl gradient-sunset mx-auto mb-6 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Popular Destinations
              </h2>
              <p className="text-muted-foreground">
                Explore trending travel spots around the world
              </p>
            </div>
            <Link to="/flights">
              <Button variant="ghost" className="hidden md:flex">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Link to={`/destination/${dest.name}`}>
                  <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all border border-border/50">
                    <div className="text-5xl mb-4">{dest.emoji}</div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{dest.country}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="text-lg font-bold text-gradient-sunset">${dest.price}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/flights">
              <Button variant="outline">
                View All Destinations
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Holiday Packages Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Curated Holiday Packages
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handpicked experiences for every type of traveler. From romantic getaways to budget-friendly adventures.
            </p>
          </motion.div>

          {/* Honeymoon Section */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Honeymoon Specials</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Maldives', subtitle: 'Tropical Paradise', price: '2,499', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800' },
                { name: 'Santorini', subtitle: 'Romantic Sunsets', price: '1,899', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800' },
                { name: 'Paris', subtitle: 'City of Love', price: '1,599', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800' },
              ].map((pkg, i) => (
                <Link to={`/destination/${pkg.name}`} key={pkg.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4]"
                  >
                    <img src={pkg.image} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                      <span className="inline-block px-3 py-1 bg-rose-500/90 rounded-full text-xs font-medium mb-3">5 Nights / 6 Days</span>
                      <h4 className="text-2xl font-bold mb-1">{pkg.name}</h4>
                      <p className="text-white/80 text-sm mb-3">{pkg.subtitle}</p>
                      <div className="flex items-center justify-between border-t border-white/20 pt-3">
                        <span className="text-sm opacity-90">Flight + Hotel</span>
                        <span className="font-bold text-lg">From ${pkg.price}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Student/Budget Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-2xl">🎒</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Student & Budget Trips</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Goa', subtitle: 'Beaches & Parties', price: '299', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800' },
                { name: 'Manali', subtitle: 'Mountain Adventure', price: '199', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800' },
                { name: 'Bali', subtitle: 'Backpacker Heaven', price: '499', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
              ].map((pkg, i) => (
                <Link to={`/destination/${pkg.name}`} key={pkg.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                        Student Special
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{pkg.name}</h4>
                        <span className="text-primary font-bold">${pkg.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{pkg.subtitle}</p>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-sunset rounded-3xl p-8 md:p-12 text-center text-primary-foreground"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of travelers who trust TravelGo for their adventures.
              Sign up today and get exclusive deals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/flights">
                <Button variant="hero-outline" size="lg">
                  <Plane className="w-5 h-5" />
                  Book a Flight
                </Button>
              </Link>
              <Link to="/hotels">
                <Button variant="hero-outline" size="lg">
                  <Hotel className="w-5 h-5" />
                  Find Hotels
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">TravelGo</span>
            </div>
            <div className="flex gap-8 text-sm text-background/70">
              <Link to="/flights" className="hover:text-background transition-colors">Flights</Link>
              <Link to="/hotels" className="hover:text-background transition-colors">Hotels</Link>
              <Link to="/bookings" className="hover:text-background transition-colors">My Bookings</Link>
            </div>
            <p className="text-sm text-background/50">
              © 2024 TravelGo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main >
  );
};

export default Index;
