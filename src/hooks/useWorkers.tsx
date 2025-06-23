
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Worker {
  id: string;
  name: string;
  photo_url?: string;
  daily_wage?: number;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface WageRecord {
  id: string;
  worker_id: string;
  date: string;
  amount: number;
  hours_worked?: number;
  notes?: string;
  created_at: string;
  worker?: Worker;
}

export const useWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [wageRecords, setWageRecords] = useState<WageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWorkers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch workers: " + error.message,
        variant: "destructive",
      });
    }
  };

  const fetchWageRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wage_records')
        .select(`
          *,
          workers (
            id,
            name,
            photo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWageRecords(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch wage records: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addWorker = async (workerData: {
    name: string;
    photo_url?: string;
    daily_wage?: number;
    phone?: string;
    address?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workers')
        .insert([{
          ...workerData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setWorkers(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Worker added successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add worker: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const addWageRecord = async (wageData: {
    worker_id: string;
    date: string;
    amount: number;
    hours_worked?: number;
    notes?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wage_records')
        .insert([{
          ...wageData,
          user_id: user.id,
        }])
        .select(`
          *,
          workers (
            id,
            name,
            photo_url
          )
        `)
        .single();

      if (error) throw error;
      
      setWageRecords(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Wage record added successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add wage record: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteWorker = async (workerId: string) => {
    try {
      const { error } = await supabase
        .from('workers')
        .delete()
        .eq('id', workerId);

      if (error) throw error;
      
      setWorkers(prev => prev.filter(worker => worker.id !== workerId));
      toast({
        title: "Success!",
        description: "Worker deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete worker: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkers();
      fetchWageRecords();
    }
  }, [user]);

  return {
    workers,
    wageRecords,
    loading,
    addWorker,
    addWageRecord,
    deleteWorker,
    refetchWorkers: fetchWorkers,
    refetchWageRecords: fetchWageRecords,
  };
};
