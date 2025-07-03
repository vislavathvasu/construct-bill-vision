
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Check, X, User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkers } from '@/hooks/useWorkers';
import { useAttendance } from '@/hooks/useAttendance';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import EditDailyWageModal from '@/components/EditDailyWageModal';
import BackdateAttendanceModal from '@/components/BackdateAttendanceModal';

const WorkerAttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { workers, loading: workersLoading, updateWorker } = useWorkers();
  const { attendanceRecords, loading: attendanceLoading, markAttendance } = useAttendance();
  const { user, loading: authLoading } = useAuth();
  const [editWageWorker, setEditWageWorker] = useState<any>(null);
  const [backdateWorker, setBackdateWorker] = useState<any>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const worker = workers.find(w => w.id === id);

  if (!worker && !workersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Worker not found</h2>
          <Button onClick={() => navigate('/attendance')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Attendance
          </Button>
        </div>
      </div>
    );
  }

  const handleMarkAttendance = async (date: Date, status: 'present' | 'absent') => {
    if (!worker) return;
    try {
      const dateStr = date.toISOString().split('T')[0];
      await markAttendance(worker.id, dateStr, status);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const handleUpdateDailyWage = async (workerId: string, newWage: number) => {
    if (!worker) return;
    try {
      await updateWorker(workerId, {
        name: worker.name,
        photo_url: worker.photo_url,
        phone: worker.phone,
        address: worker.address,
        daily_wage: newWage
      });
    } catch (error) {
      console.error('Failed to update daily wage:', error);
    }
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.find(record => 
      record.worker_id === worker?.id && record.date === today
    )?.status;
  };

  if (workersLoading || attendanceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const todayStatus = getTodayAttendance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/attendance')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-800">
                {worker?.name} - Attendance Details
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Worker Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {worker?.photo_url ? (
                <img 
                  src={worker.photo_url} 
                  alt="Worker"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{worker?.name}</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600">Daily Wage: ₹{worker?.daily_wage}</p>
                  <Button
                    onClick={() => setEditWageWorker(worker)}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={12} />
                  </Button>
                </div>
                {worker?.phone && (
                  <p className="text-sm text-gray-500">{worker.phone}</p>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => setBackdateWorker(worker)}
              variant="outline"
              className="text-purple-500 border-purple-200 hover:bg-purple-50"
            >
              <Calendar size={16} className="mr-2" />
              Select Date
            </Button>
          </div>
        </div>

        {/* Today's Attendance Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Status:</span>
              {todayStatus ? (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  todayStatus === 'present' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {todayStatus === 'present' ? 'Present Today' : 'Absent Today'}
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Not Marked
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => handleMarkAttendance(new Date(), 'present')}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <Check size={16} className="mr-2" />
                Present Today
              </Button>
              <Button
                onClick={() => handleMarkAttendance(new Date(), 'absent')}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                <X size={16} className="mr-2" />
                Absent Today
              </Button>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Attendance Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {attendanceRecords.filter(r => r.worker_id === worker?.id && r.status === 'present').length}
              </div>
              <div className="text-sm text-green-700">Days Present</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {attendanceRecords.filter(r => r.worker_id === worker?.id && r.status === 'absent').length}
              </div>
              <div className="text-sm text-red-700">Days Absent</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {attendanceRecords.filter(r => r.worker_id === worker?.id).length}
              </div>
              <div className="text-sm text-blue-700">Total Records</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editWageWorker && (
        <EditDailyWageModal
          worker={editWageWorker}
          onSave={handleUpdateDailyWage}
          onClose={() => setEditWageWorker(null)}
        />
      )}

      {backdateWorker && (
        <BackdateAttendanceModal
          worker={backdateWorker}
          onMarkAttendance={(workerId, date, status) => {
            const dateObj = new Date(date);
            handleMarkAttendance(dateObj, status);
          }}
          onClose={() => setBackdateWorker(null)}
          getAttendanceStatus={(workerId: string, date: string) => {
            return attendanceRecords.find(record => 
              record.worker_id === workerId && record.date === date
            )?.status;
          }}
        />
      )}
    </div>
  );
};

export default WorkerAttendancePage;
