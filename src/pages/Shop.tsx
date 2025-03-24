
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
        // Get local products
        const localProducts = getLocalProducts();
        
        if (!localProducts || !localProducts.length) {
          throw new Error("No products found");
        }
        
        console.log(`Loaded ${localProducts.length} products`);
        setProducts(localProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Using demo data instead.");
        
        // Fall back to demo products
        const demoProducts = getDemoProducts();
        setProducts(demoProducts);
        console.log(`Loaded ${demoProducts.length} demo products instead`);
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
    try {
      // Create a cart item from the product
      const cartItem = {
        variantId: product.variants[0]?.id || product.id,
        quantity: 1,
        title: product.title,
        price: product.variants[0]?.price || "0",
        image: product.images[0]?.src,
        variantTitle: product.variants[0]?.title || "Regular"
      };
      
      // Add to cart
      addItem(cartItem);
      console.log("Added to cart from Shop page:", cartItem);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
    }
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
