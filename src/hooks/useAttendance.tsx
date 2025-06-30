
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  worker_id: string;
  date: string;
  status: 'present' | 'absent';
  created_at: string;
  updated_at: string;
}

export interface AdvanceRecord {
  id: string;
  worker_id: string;
  amount: number;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [advanceRecords, setAdvanceRecords] = useState<AdvanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAttendanceRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance records: " + error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAdvanceRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('advances')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAdvanceRecords(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch advance records: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (workerId: string, date: string, status: 'present' | 'absent') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('attendance')
        .upsert([{
          worker_id: workerId,
          date,
          status,
          user_id: user.id,
        }], { 
          onConflict: 'worker_id,date'
        })
        .select()
        .single();

      if (error) throw error;
      
      setAttendanceRecords(prev => {
        const filtered = prev.filter(record => !(record.worker_id === workerId && record.date === date));
        return [data, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      
      toast({
        title: "Success!",
        description: `Attendance marked as ${status}.`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark attendance: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const addAdvance = async (advanceData: {
    worker_id: string;
    amount: number;
    date: string;
    description?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('advances')
        .insert([{
          ...advanceData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setAdvanceRecords(prev => [data, ...prev]);
      toast({
        title: "Success!",
        description: "Advance payment recorded successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to record advance: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getWorkerAttendance = (workerId: string, month?: string, year?: string) => {
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const matchesWorker = record.worker_id === workerId;
      
      if (month && year) {
        const recordMonth = recordDate.getMonth() + 1;
        const recordYear = recordDate.getFullYear();
        return matchesWorker && recordMonth === parseInt(month) && recordYear === parseInt(year);
      }
      
      return matchesWorker;
    });
  };

  const getWorkerAdvances = (workerId: string, month?: string, year?: string) => {
    return advanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const matchesWorker = record.worker_id === workerId;
      
      if (month && year) {
        const recordMonth = recordDate.getMonth() + 1;
        const recordYear = recordDate.getFullYear();
        return matchesWorker && recordMonth === parseInt(month) && recordYear === parseInt(year);
      }
      
      return matchesWorker;
    });
  };

  useEffect(() => {
    if (user) {
      fetchAttendanceRecords();
      fetchAdvanceRecords();
    }
  }, [user]);

  return {
    attendanceRecords,
    advanceRecords,
    loading,
    markAttendance,
    addAdvance,
    getWorkerAttendance,
    getWorkerAdvances,
    refetchAttendance: fetchAttendanceRecords,
    refetchAdvances: fetchAdvanceRecords,
  };
};
