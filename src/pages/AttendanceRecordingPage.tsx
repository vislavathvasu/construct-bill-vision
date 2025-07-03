
import React, { useState } from 'react';
import { ArrowLeft, User, Check, X, Calendar, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWorkers } from '@/hooks/useWorkers';
import { useAttendance } from '@/hooks/useAttendance';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import EditDailyWageModal from '@/components/EditDailyWageModal';
import BackdateAttendanceModal from '@/components/BackdateAttendanceModal';

const AttendanceRecordingPage: React.FC = () => {
  const navigate = useNavigate();
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

  // Generate calendar dates for current month
  const generateCalendarDates = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  const getAttendanceStatus = (workerId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return attendanceRecords.find(record => 
      record.worker_id === workerId && record.date === dateStr
    )?.status;
  };

  const handleMarkAttendance = async (workerId: string, date: Date, status: 'present' | 'absent') => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      await markAttendance(workerId, dateStr, status);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const handleUpdateDailyWage = async (workerId: string, newWage: number) => {
    try {
      const worker = workers.find(w => w.id === workerId);
      if (worker) {
        await updateWorker(workerId, {
          name: worker.name,
          photo_url: worker.photo_url,
          phone: worker.phone,
          address: worker.address,
          daily_wage: newWage
        });
      }
    } catch (error) {
      console.error('Failed to update daily wage:', error);
    }
  };

  const getTodayAttendance = (workerId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.find(record => 
      record.worker_id === workerId && record.date === today
    )?.status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Attendance Recording</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {workersLoading || attendanceLoading ? (
          <div className="text-center py-12">Loading workers and attendance...</div>
        ) : (
          <div className="flex gap-6">
            {/* Left Side - Workers List */}
            <div className="w-1/3">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Workers</h2>
              <div className="space-y-3">
                {workers.map((worker) => {
                  const todayStatus = getTodayAttendance(worker.id);
                  
                  return (
                    <div 
                      key={worker.id}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {worker.photo_url ? (
                            <img 
                              src={worker.photo_url} 
                              alt="Worker"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-800">{worker.name}</h3>
                            <p className="text-sm text-gray-600">₹{worker.daily_wage}/day</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => setBackdateWorker(worker)}
                            variant="outline"
                            size="sm"
                            className="p-2"
                            title="Select Date"
                          >
                            <Calendar size={16} />
                          </Button>
                          
                          <Button
                            onClick={() => setEditWageWorker(worker)}
                            variant="outline"
                            size="sm"
                            className="p-2"
                            title="Edit Wage"
                          >
                            <Edit size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Today's Attendance Status */}
                      <div className="mb-3">
                        {todayStatus ? (
                          <div className={`px-2 py-1 rounded text-xs font-medium text-center ${
                            todayStatus === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {todayStatus === 'present' ? 'Present Today' : 'Absent Today'}
                          </div>
                        ) : (
                          <div className="px-2 py-1 rounded text-xs font-medium text-center bg-gray-100 text-gray-800">
                            Not Marked
                          </div>
                        )}
                      </div>

                      {/* Today's Attendance Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleMarkAttendance(worker.id, new Date(), 'present')}
                          size="sm"
                          className="flex-1 bg-green-500 hover:bg-green-600 text-xs"
                        >
                          <Check size={12} className="mr-1" />
                          Present Today
                        </Button>
                        <Button
                          onClick={() => handleMarkAttendance(worker.id, new Date(), 'absent')}
                          size="sm"
                          className="flex-1 bg-red-500 hover:bg-red-600 text-xs"
                        >
                          <X size={12} className="mr-1" />
                          Absent Today
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Calendar */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Attendance Calendar - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                {/* Calendar Header */}
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="font-semibold text-sm text-gray-600 p-2">Worker</div>
                  {calendarDates.map((date) => (
                    <div key={date.toISOString()} className="text-center p-2">
                      <div className="font-semibold text-sm text-gray-800">
                        {date.getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attendance Grid */}
                <div className="space-y-2">
                  {workers.map((worker) => (
                    <div key={worker.id} className="grid grid-cols-8 gap-2 items-center py-2 border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        {worker.photo_url ? (
                          <img 
                            src={worker.photo_url} 
                            alt="Worker"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={12} className="text-gray-500" />
                          </div>
                        )}
                        <span className="text-sm font-medium truncate">{worker.name}</span>
                      </div>
                      
                      {calendarDates.map((date) => {
                        const status = getAttendanceStatus(worker.id, date);
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                        
                        return (
                          <div key={date.toISOString()} className="flex justify-center">
                            {status ? (
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                  status === 'present' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              >
                                {status === 'present' ? 'P' : 'A'}
                              </div>
                            ) : isToday ? (
                              <div className="flex space-x-1">
                                <Button
                                  onClick={() => handleMarkAttendance(worker.id, date, 'present')}
                                  size="sm"
                                  className="w-6 h-6 p-0 bg-green-500 hover:bg-green-600"
                                >
                                  <Check size={12} />
                                </Button>
                                <Button
                                  onClick={() => handleMarkAttendance(worker.id, date, 'absent')}
                                  size="sm"
                                  className="w-6 h-6 p-0 bg-red-500 hover:bg-red-600"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            ) : isPast ? (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">-</span>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-400">-</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
            handleMarkAttendance(workerId, dateObj, status);
          }}
          onClose={() => setBackdateWorker(null)}
          getAttendanceStatus={(workerId: string, date: string) => {
            const dateObj = new Date(date);
            return getAttendanceStatus(workerId, dateObj);
          }}
        />
      )}
    </div>
  );
};

export default AttendanceRecordingPage;
