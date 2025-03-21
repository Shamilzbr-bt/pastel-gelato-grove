
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { ShopifyProduct } from '@/services/shopify';
import { formatPrice } from '@/utils/formatters';

interface ProductCardProps {
  product: ShopifyProduct;
  onAddToCart: (product: ShopifyProduct) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={product.images[0]?.src || 'https://placehold.co/400'} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur-sm text-gelatico-pink">
            {product.tags?.split(',')[0].trim() || 'Product'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2">{product.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {formatPrice(product.variants[0]?.price || '0')}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center justify-center p-2 rounded-full bg-gelatico-pink text-white hover:bg-gelatico-pink/90 transition-all duration-300"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
