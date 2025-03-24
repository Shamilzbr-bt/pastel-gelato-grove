
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        setUser(session.user);
        
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setPhone(data.phone || '');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate('/auth');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      
      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      } : null);
      
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="page-container pt-32 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 size={40} className="animate-spin text-gelatico-pink mb-4" />
            <p>Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            My Account
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6">
            Your Profile
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updating}
                    >
                      {updating ? (
                        <span className="flex items-center">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Updating...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-semibold mb-6">Account Actions</h2>
                <Button 
                  variant="destructive" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="bg-white p-6 rounded-xl shadow-sm border min-h-[300px]">
                <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
                
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                  <Button 
                    onClick={() => navigate('/shop')}
                    variant="outline"
                  >
                    Start Shopping
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <div className="text-center mt-12">
          <Button 
            variant="link" 
            onClick={() => navigate('/shop')}
          >
            Back to Shop
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
