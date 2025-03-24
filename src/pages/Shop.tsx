import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import ShopPageHeader from '@/components/shop/ShopPageHeader';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductGrid from '@/components/shop/ProductGrid';
import GiftCardHighlight from '@/components/shop/GiftCardHighlight';
import { getLocalProducts, getDemoProducts } from '@/data/products';
import { useCart } from '@/hooks/useCart';

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: { src: string }[];
  variants: {
    id: string;
    price: string;
    title: string;
  }[];
  tags: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { addItem } = useCart();
  
  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        // Get local products only
        const localProducts = getLocalProducts();
        setProducts(localProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Using demo data instead.");
        
        // Fall back to demo products
        setProducts(getDemoProducts());
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Extract categories from product tags
  const categories = Array.from(
    new Set(
      products
        .flatMap(p => p.tags ? p.tags.split(',').map(tag => tag.trim()) : [])
        .filter(tag => tag)
    )
  );
  
  const filteredProducts = activeCategory 
    ? products.filter(product => 
        product.tags && product.tags.split(',').map(t => t.trim()).includes(activeCategory)
      ) 
    : products;
  
  const onAddToCart = (product: Product) => {
    // This function is passed to ProductCard but the actual implementation is in ProductCard now
    // We'll keep it for compatibility but it's not directly used anymore
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <ShopPageHeader />
        
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        
        {/* Products Grid */}
        <ProductGrid 
          products={filteredProducts} 
          isLoading={isLoading} 
          onAddToCart={onAddToCart}
          onResetCategory={() => setActiveCategory(null)}
        />
        
        {/* Gift Cards Highlight */}
        <GiftCardHighlight 
          onViewGiftCards={() => setActiveCategory("Gift Cards")} 
        />
      </div>
      
      <Footer />
    </div>
  );
}
