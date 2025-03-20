
import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  image: string;
  mapUrl: string;
}

export default function LocationFinder() {
  const [activeLocation, setActiveLocation] = useState(0);
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: 'Gelatico Downtown',
      address: '123 Sweet Street',
      city: 'New York, NY 10001',
      phone: '+1 (212) 555-0123',
      hours: 'Mon-Sun: 11am - 10pm',
      image: 'https://images.unsplash.com/photo-1631651738795-b89313168669?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.google.com'
    },
    {
      id: 2,
      name: 'Gelatico Beachside',
      address: '456 Ocean Avenue',
      city: 'Miami, FL 33139',
      phone: '+1 (305) 555-0456',
      hours: 'Mon-Sun: 10am - 11pm',
      image: 'https://images.unsplash.com/photo-1532704868953-d5f3aae5b98a?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.google.com'
    },
    {
      id: 3,
      name: 'Gelatico Hills',
      address: '789 Highland Road',
      city: 'Los Angeles, CA 90210',
      phone: '+1 (323) 555-0789',
      hours: 'Mon-Sun: 11am - 9pm',
      image: 'https://images.unsplash.com/photo-1631651740656-5c479a041f39?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.google.com'
    }
  ]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            Find Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-gelatico mb-6">
            Visit Our Stores
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience Gelatico in person at one of our beautiful locations. Each store offers 
            the full range of our signature flavors, along with special local creations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Selector */}
          <div className="lg:col-span-1 space-y-4">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                whileHover={{ x: 5 }}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeLocation === index 
                    ? 'bg-gradient-to-r from-gelatico-pink/10 to-gelatico-baby-pink/20 shadow-soft' 
                    : 'hover:bg-gelatico-peach-cream/30'
                }`}
                onClick={() => setActiveLocation(index)}
              >
                <h3 className="text-xl font-bold mb-2 font-gelatico">{location.name}</h3>
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="text-gelatico-pink mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    {location.address}, {location.city}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Phone size={18} className="text-gelatico-pink flex-shrink-0" />
                  <p className="text-muted-foreground">{location.phone}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock size={18} className="text-gelatico-pink flex-shrink-0" />
                  <p className="text-muted-foreground">{location.hours}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Location Image and Map Link */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeLocation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden shadow-soft h-[400px] relative"
            >
              <img 
                src={locations[activeLocation].image} 
                alt={locations[activeLocation].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-2 font-gelatico">
                        {locations[activeLocation].name}
                      </h3>
                      <p className="text-white/80">
                        {locations[activeLocation].address}, {locations[activeLocation].city}
                      </p>
                    </div>
                    <a 
                      href={locations[activeLocation].mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View on Map
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
