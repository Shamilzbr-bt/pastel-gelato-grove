
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/pages/Shop';
import { formatPrice } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addItem } = useCart();
  
  // Helper function to parse price safely
  const parsePrice = (price: string | undefined): number => {
    if (!price) return 0;
    return parseFloat(price);
  };

  // Helper function to clean image path
  const cleanImagePath = (path: string) => {
    // Remove /public prefix if it exists
    if (path.startsWith('/public/')) {
      return path.substring(7);
    }
    return path;
  };
  
  // Direct add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a cart item
    const cartItem = {
      variantId: product.variants[0]?.id || product.id,
      quantity: 1,
      title: product.title,
      price: product.variants[0]?.price || "0",
      image: product.images[0]?.src,
      variantTitle: product.variants[0]?.title || "Regular"
    };
    
    addItem(cartItem);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="card">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={cleanImagePath(product.images[0]?.src || 'https://placehold.co/400')} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/lovable-uploads/ee7dd54f-f5d1-41fb-9c95-21e2916f3ee7.png';
              console.log(`Failed to load image: ${product.images[0]?.src}`);
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur-sm text-gelatico-pink">
              {product.tags?.split(',')[0].trim() || 'Product'}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="heading text-lg font-bold mb-2">{product.title}</h3>
          <p className="text-white text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">
              {formatPrice(parsePrice(product.variants[0]?.price || '0'))}
            </span>
            <div className="flex gap-2">
              <Link
                to={`/product/${product.id}`}
                className="inline-flex items-center justify-center p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                aria-label={`View ${product.title} details`}
              >
                <Eye size={18} />
              </Link>
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center p-2 rounded-full bg-gelatico-pink text-white hover:bg-gelatico-pink/90 transition-all duration-300"
                aria-label={`Add ${product.title} to cart`}
              >
                <ShoppingBag size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
