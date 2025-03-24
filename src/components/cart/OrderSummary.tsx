
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  handleCheckout: () => void;
  isCheckingOut: boolean;
  cartItemsEmpty: boolean;
}

export default function OrderSummary({ 
  subtotal, 
  shippingFee, 
  total, 
  handleCheckout, 
  isCheckingOut,
  cartItemsEmpty
}: OrderSummaryProps) {
  return (
    <div className="bg-muted/10 p-6 rounded-2xl border border-muted h-fit">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <ShoppingBag size={18} className="mr-2" />
        Order Summary
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{subtotal.toFixed(3)} KD</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shippingFee === 0 
              ? <span className="text-green-600">Free</span> 
              : `${shippingFee.toFixed(3)} KD`
            }
          </span>
        </div>
        
        {shippingFee > 0 && (
          <div className="text-sm text-muted-foreground">
            Free shipping on orders over 15 KD
          </div>
        )}
        
        <div className="border-t border-muted pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>{total.toFixed(3)} KD</span>
        </div>
      </div>
      
      <Button
        onClick={handleCheckout}
        disabled={isCheckingOut || cartItemsEmpty}
        className="w-full flex items-center justify-center bg-gelatico-pink hover:bg-gelatico-pink/90 transition-all"
      >
        {isCheckingOut ? (
          <span className="flex items-center">
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Checkout
            <ArrowRight size={16} className="ml-2" />
          </span>
        )}
      </Button>
      
      <div className="mt-4">
        <Link 
          to="/shop" 
          className="text-sm text-center block text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
