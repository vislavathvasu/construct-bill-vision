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

export interface ExpenditureRecord {
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
  const [expenditureRecords, setExpenditureRecords] = useState<ExpenditureRecord[]>([]);
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

  const fetchExpenditureRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wage_records')
        .select(`
          *,
          worker:workers!inner (
            id,
            name,
            photo_url,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenditureRecords(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch expenditure records: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addWorker = async (workerData: {
    name: string;
    photo_url?: string;
    phone?: string;
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

  const addExpenditureRecord = async (expenditureData: {
    worker_id: string;
    date: string;
    amount: number;
    notes?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wage_records')
        .insert([{
          ...expenditureData,
          user_id: user.id,
        }])
        .select(`
          *,
          workers (
            id,
            name,
            photo_url,
            phone
          )
        `)
        .single();

      if (error) throw error;
      
      setExpenditureRecords(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Expenditure record added successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add expenditure record: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateWorker = async (workerId: string, workerData: {
    name: string;
    photo_url?: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(workerData)
        .eq('id', workerId)
        .select()
        .single();

      if (error) throw error;
      
      setWorkers(prev => prev.map(worker => worker.id === workerId ? data : worker));
      toast({
        title: "Success!",
        description: "Worker updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update worker: " + error.message,
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
      fetchExpenditureRecords();
    }
  }, [user]);

  return {
    workers,
    expenditureRecords,
    loading,
    addWorker,
    addExpenditureRecord,
    updateWorker,
    deleteWorker,
    refetchWorkers: fetchWorkers,
    refetchExpenditureRecords: fetchExpenditureRecords,
  };
};
