
import React, { useState } from 'react';
import { ArrowLeft, Check, X, User, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const currentDate = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const attendanceRecord = attendanceRecords.find(record => 
          record.worker_id === id && record.date === dateStr
        );
        const isCurrentMonth = currentDate.getMonth() === selectedMonth - 1;
        
        weekDays.push({
          date: new Date(currentDate),
          dateStr,
          day: currentDate.getDate(),
          isCurrentMonth,
          status: attendanceRecord?.status,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(weekDays);
      
      if (currentDate > lastDay && week > 3) break;
    }
    
    return calendar;
  };

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

  // Get today's attendance status
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.find(record => 
    record.worker_id === id && record.date === todayStr
  );

  const calendar = generateCalendar();

  if (workersLoading || attendanceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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

        {/* Today's Attendance Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance</h3>
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              Today ({today.toLocaleDateString()}): 
              {todayAttendance ? (
                <span className={`ml-2 font-semibold ${
                  todayAttendance.status === 'present' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {todayAttendance.status === 'present' ? 'Present' : 'Absent'}
                </span>
              ) : (
                <span className="ml-2 font-semibold text-gray-500">Not Marked</span>
              )}
            </div>
            
            {!todayAttendance && (
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleMarkAttendance(today, 'present')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check size={16} className="mr-2" />
                  Present Today
                </Button>
                <Button
                  onClick={() => handleMarkAttendance(today, 'absent')}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <X size={16} className="mr-2" />
                  Absent Today
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Calendar */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Attendance Calendar
            </h3>
            
            <div className="flex items-center space-x-4">
              <Calendar size={20} className="text-gray-500" />
              <Select 
                value={selectedMonth.toString()} 
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            
            {calendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`
                      text-center p-3 text-sm rounded min-h-[60px] flex flex-col items-center justify-center
                      ${!day.isCurrentMonth ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white border border-gray-200'}
                      ${day.status === 'present' ? 'bg-green-100 border-green-300 text-green-800' : ''}
                      ${day.status === 'absent' ? 'bg-red-100 border-red-300 text-red-800' : ''}
                    `}
                  >
                    <div className="font-semibold mb-1">{day.day}</div>
                    {day.isCurrentMonth && day.status && (
                      <div className={`text-xs font-bold px-2 py-1 rounded ${
                        day.status === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {day.status === 'present' ? 'P' : 'A'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
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
