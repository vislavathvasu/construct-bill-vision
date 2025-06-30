
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Check, X, User, UserCheck, UserX, DollarSign, CalendarDays, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useWorkers } from '@/hooks/useWorkers';
import { useAttendance } from '@/hooks/useAttendance';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import EditDailyWageModal from '@/components/EditDailyWageModal';
import BackdateAttendanceModal from '@/components/BackdateAttendanceModal';

const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const { workers, loading: workersLoading, updateWorker } = useWorkers();
  const { attendanceRecords, loading: attendanceLoading, markAttendance } = useAttendance();
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceStatus = (workerId: string, date: string) => {
    return attendanceRecords.find(record => 
      record.worker_id === workerId && record.date === date
    )?.status;
  };

  const handleMarkAttendance = async (workerId: string, status: 'present' | 'absent', date?: string) => {
    try {
      await markAttendance(workerId, date || selectedDate, status);
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

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendanceRecords.filter(record => record.date === today);
    const present = todayAttendance.filter(record => record.status === 'present').length;
    const absent = todayAttendance.filter(record => record.status === 'absent').length;
    const total = workers.length;
    const notMarked = total - present - absent;

    return { present, absent, notMarked, total };
  };

  const stats = getTodayStats();

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
              <h1 className="text-xl font-bold text-gray-800">Worker Attendance</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Present Today</p>
                <p className="text-2xl font-bold">{stats.present}</p>
              </div>
              <UserCheck size={24} className="text-green-200" />
            </div>
          </div>
          
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Absent Today</p>
                <p className="text-2xl font-bold">{stats.absent}</p>
              </div>
              <UserX size={24} className="text-red-200" />
            </div>
          </div>
          
          <div className="bg-orange-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Not Marked</p>
                <p className="text-2xl font-bold">{stats.notMarked}</p>
              </div>
              <User size={24} className="text-orange-200" />
            </div>
          </div>
          
          <div className="bg-blue-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Workers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <User size={24} className="text-blue-200" />
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-500" />
              <label htmlFor="date" className="font-medium text-gray-700">Select Date:</label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            
            <div className="relative">
              <Input
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* Workers List */}
        {workersLoading || attendanceLoading ? (
          <div className="text-center py-12">Loading workers and attendance...</div>
        ) : (
          <div className="space-y-4">
            {filteredWorkers.map((worker) => {
              const attendanceStatus = getAttendanceStatus(worker.id, selectedDate);
              
              return (
                <div 
                  key={worker.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {worker.photo_url ? (
                        <img 
                          src={worker.photo_url} 
                          alt="Worker"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={24} className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{worker.name}</h3>
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-600">Daily Wage: ₹{worker.daily_wage}</p>
                          <Button
                            onClick={() => setEditWageWorker(worker)}
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6 text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={12} />
                          </Button>
                        </div>
                        {attendanceStatus && (
                          <p className={`text-sm font-medium ${
                            attendanceStatus === 'present' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Status: {attendanceStatus === 'present' ? 'Present' : 'Absent'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button
                        onClick={() => setBackdateWorker(worker)}
                        variant="outline"
                        size="sm"
                        className="text-purple-500 border-purple-200 hover:bg-purple-50"
                      >
                        <CalendarDays size={16} className="mr-2" />
                        Backdate
                      </Button>
                      
                      <Button
                        onClick={() => handleMarkAttendance(worker.id, 'present')}
                        className={`${
                          attendanceStatus === 'present' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                        disabled={attendanceStatus === 'present'}
                      >
                        <Check size={20} className="mr-2" />
                        Present
                      </Button>
                      
                      <Button
                        onClick={() => handleMarkAttendance(worker.id, 'absent')}
                        className={`${
                          attendanceStatus === 'absent' 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                        disabled={attendanceStatus === 'absent'}
                      >
                        <X size={20} className="mr-2" />
                        Absent
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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
          onMarkAttendance={handleMarkAttendance}
          onClose={() => setBackdateWorker(null)}
          getAttendanceStatus={getAttendanceStatus}
        />
      )}
    </div>
  );
};

export default AttendancePage;
