
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, ShoppingBag } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Flavor } from "@/models/Flavor";
import { formatPrice } from "@/utils/formatters";
import FlavorImage from './flavor/FlavorImage';
import FlavorDetailDialog from './flavor/FlavorDetailDialog';

interface FlavorCardProps {
  flavor: Flavor;
  layout?: 'grid' | 'featured';
}

export default function FlavorCard({ flavor, layout = 'grid' }: FlavorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${flavor.name} added to your cart!`);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <motion.div
      whileHover={layout === 'grid' ? { y: -8 } : undefined}
      className={cn(
        "group overflow-hidden",
        layout === 'grid' 
          ? "h-full rounded-2xl transition-all duration-300"
          : "flex flex-col md:flex-row items-start gap-8 my-12 p-6 rounded-3xl bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm shadow-soft"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/product/${flavor.id}`}
        className="block h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn(
          "card",
          layout === 'grid' ? "h-full w-full" : ""
        )}>
          <FlavorImage 
            image={flavor.image}
            name={flavor.name}
            tags={flavor.tags}
            layout={layout}
          />
          
          <div className={cn(
            "p-4",
            layout === 'featured' && "md:flex-1"
          )}>
            <h3 className="heading text-xl font-bold font-gelatico mb-2 group-hover:text-gelatico-pink transition-colors duration-300">
              {flavor.name}
            </h3>
            
            <p className="text-gray-300 mb-3 line-clamp-2">
              {flavor.description}
            </p>
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-semibold text-gelatico-pink">
                {formatPrice(flavor.price || 0)}
              </span>
              
              <div className="flex items-center space-x-2">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-gelatico-pink text-gelatico-pink hover:bg-gelatico-baby-pink hover:bg-opacity-20"
                      onClick={handleInfoClick}
                    >
                      <Info size={18} />
                    </Button>
                  </DialogTrigger>
                  <FlavorDetailDialog 
                    flavor={flavor}
                    onAddToCart={handleAddToCart}
                  />
                </Dialog>
                
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full bg-gelatico-pink hover:bg-gelatico-pink/90 text-white"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
