
import React, { useState } from 'react';
import { X, Calendar, Check, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Worker } from '@/hooks/useWorkers';
import { cn } from '@/lib/utils';

interface BackdateAttendanceModalProps {
  worker: Worker;
  onMarkAttendance: (workerId: string, date: string, status: 'present' | 'absent') => void;
  onClose: () => void;
  getAttendanceStatus: (workerId: string, date: string) => 'present' | 'absent' | undefined;
}

const BackdateAttendanceModal: React.FC<BackdateAttendanceModalProps> = ({ 
  worker, 
  onMarkAttendance, 
  onClose,
  getAttendanceStatus 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleMarkAttendance = (status: 'present' | 'absent') => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      onMarkAttendance(worker.id, dateStr, status);
    }
  };

  const currentStatus = selectedDate ? getAttendanceStatus(worker.id, selectedDate.toISOString().split('T')[0]) : undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Backdate Attendance</h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            {worker.photo_url ? (
              <img 
                src={worker.photo_url} 
                alt="Worker"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {worker.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{worker.name}</h3>
              <p className="text-sm text-gray-600">Select a date to mark attendance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {selectedDate && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Current status for {format(selectedDate, "MMM dd, yyyy")}:
                  <span className={`ml-2 font-medium ${
                    currentStatus === 'present' ? 'text-green-600' : 
                    currentStatus === 'absent' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {currentStatus ? currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1) : 'Not marked'}
                  </span>
                </p>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleMarkAttendance('present')}
                    className={`flex-1 ${
                      currentStatus === 'present' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <Check size={16} className="mr-2" />
                    Present
                  </Button>
                  
                  <Button
                    onClick={() => handleMarkAttendance('absent')}
                    className={`flex-1 ${
                      currentStatus === 'absent' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    <XIcon size={16} className="mr-2" />
                    Absent
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackdateAttendanceModal;
