
import { useState, useEffect } from "react";
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

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('gelatico-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
      localStorage.removeItem('gelatico-cart');
    }
  }, []);
  
  // Create separate effect for listening to cart updates to avoid infinite loops
  useEffect(() => {
    // Listen for cart updates from other tabs/components
    const handleCartUpdate = (event: Event) => {
      try {
        const updatedCart = localStorage.getItem('gelatico-cart');
        if (updatedCart) {
          setCartItems(JSON.parse(updatedCart));
        }
      } catch (e) {
        console.error('Error parsing updated cart:', e);
      }
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'gelatico-cart') {
        handleCartUpdate(e);
      }
    });
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);
  
  // Save cart on change
  useEffect(() => {
    try {
      localStorage.setItem('gelatico-cart', JSON.stringify(cartItems));
      // Dispatch event for other components to pick up
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cartItems]);
  
  const addItem = (item: CartItem) => {
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
  };
  
  const updateQuantity = (variantId: string, newQuantity: number) => {
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
  };
  
  const removeItem = (variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
    toast.success("Item removed from cart");
  };
  
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('gelatico-cart');
    toast.success("Cart cleared");
  };
  
  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => {
      const price = item.price ? parseFloat(item.price) : 0;
      return total + (price * item.quantity);
    }, 0);
  };
  
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
