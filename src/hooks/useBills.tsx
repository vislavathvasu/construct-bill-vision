
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseBill {
  id: string;
  shop_name: string;
  material: string;
  amount: number;
  date: string;
  location?: string;
  bill_photo_url?: string;
  bill_image_path?: string;
  created_at: string;
  updated_at: string;
}

export const useBills = () => {
  const [bills, setBills] = useState<DatabaseBill[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBills = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBills(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch bills: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBill = async (billData: {
    shop_name: string;
    material: string;
    amount: number;
    date: string;
    location?: string;
    bill_photo_url?: string;
    bill_image_path?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([{
          ...billData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setBills(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Bill added successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add bill: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBill = async (billId: string, billData: {
    shop_name: string;
    material: string;
    amount: number;
    date: string;
    location?: string;
    bill_photo_url?: string;
    bill_image_path?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .update(billData)
        .eq('id', billId)
        .select()
        .single();

      if (error) throw error;
      
      setBills(prev => prev.map(bill => bill.id === billId ? data : bill));
      toast({
        title: "Success!",
        description: "Bill updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update bill: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBill = async (billId: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId);

      if (error) throw error;
      
      setBills(prev => prev.filter(bill => bill.id !== billId));
      toast({
        title: "Success!",
        description: "Bill deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete bill: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBills();
  }, [user]);

  return {
    bills,
    loading,
    addBill,
    updateBill,
    deleteBill,
    refetch: fetchBills,
  };
};
