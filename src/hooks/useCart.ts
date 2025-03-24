
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ContainerOption } from "@/components/product/ContainerSelector";

export interface CartItem {
  variantId: string;
  quantity: number;
  title?: string;
  price?: string;
  image?: string;
  variantTitle?: string;
  customizations?: {
    container?: ContainerOption;
    toppings?: Array<{
      id: string;
      name: string;
      price: number;
      category: string;
    }>;
    toppingNames?: string;
  };
}

const CART_STORAGE_KEY = 'gelatico-cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Load cart on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);
  
  // Save cart on change, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        // Dispatch event for other components to pick up
        window.dispatchEvent(new Event('cart-updated'));
      } catch (e) {
        console.error('Error saving cart to localStorage:', e);
      }
    }
  }, [cartItems, isInitialized]);
  
  // Create separate effect for listening to cart updates from other tabs/components
  useEffect(() => {
    // Listen for cart updates from other tabs/components
    const handleCartUpdate = (event: Event) => {
      if (!event.target) return;
      
      try {
        const updatedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (updatedCart) {
          const parsedCart = JSON.parse(updatedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }
      } catch (e) {
        console.error('Error parsing updated cart:', e);
      }
    };
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        handleCartUpdate(e);
      }
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const addItem = useCallback((item: CartItem) => {
    if (!item.variantId) {
      console.error("Cannot add item without variantId:", item);
      toast.error("Could not add item to cart - missing information");
      return;
    }
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.variantId === item.variantId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
    
    toast.success(`${item.title || 'Product'} added to cart`);
  }, []);
  
  const updateQuantity = useCallback((variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(variantId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.variantId === variantId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }, []);
  
  const removeItem = useCallback((variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
    toast.success("Item removed from cart");
  }, []);
  
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast.success("Cart cleared");
  }, []);
  
  const calculateSubtotal = useCallback((): number => {
    return cartItems.reduce((total, item) => {
      const price = item.price ? parseFloat(item.price) : 0;
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);
  
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  return {
    cartItems,
    setCartItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    calculateSubtotal,
    itemCount,
  };
}
