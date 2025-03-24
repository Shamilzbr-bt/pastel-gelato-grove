
import { toast } from "sonner";
import { CartItem } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutAddress {
  first_name?: string;
  last_name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

export interface CheckoutOptions {
  email?: string;
  address?: CheckoutAddress;
}

export const checkoutService = {
  /**
   * Process checkout locally
   */
  async processCheckout(items: CartItem[], options: CheckoutOptions = {}) {
    try {
      if (!items.length) {
        throw new Error('Cannot create checkout with empty cart');
      }

      // Log what we're processing
      console.log('Processing checkout with items:', items);
      console.log('Checkout options:', options);

      // Get current user (if authenticated)
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => {
        const price = item.price ? parseFloat(item.price) : 0;
        return sum + (price * item.quantity);
      }, 0);

      console.log(`Total order amount: ${totalAmount}`);
      
      // Generate a formatted order summary
      const orderSummary = items.map(item => {
        return {
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          container: item.customizations?.container?.name,
          toppings: item.customizations?.toppingNames,
          total: (parseFloat(item.price || "0") * item.quantity).toFixed(3)
        };
      });
      
      console.log('Order summary:', orderSummary);
      
      // In a real application, you would:
      // 1. Save the order to a database
      // 2. Process payment through a payment gateway
      // 3. Send confirmation emails
      // 4. Update inventory

      // Generate a unique order ID
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // If the user is logged in, store the order in the database
      if (userId) {
        try {
          const { error } = await supabase
            .from('orders')
            .insert({
              id: orderId,
              user_id: userId,
              total_amount: totalAmount,
              items: orderSummary,
              status: 'pending',
              delivery_address: options.address,
              special_instructions: ''
            });
          
          if (error) {
            console.error('Error saving order to database:', error);
          }
        } catch (dbError) {
          console.error('Error storing order in database:', dbError);
          // Continue with checkout even if database storage fails
        }
      }
      
      return {
        success: true,
        orderId,
        totalAmount,
        orderSummary,
        message: 'Order processed successfully'
      };
    } catch (error) {
      console.error('Error processing checkout:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};
