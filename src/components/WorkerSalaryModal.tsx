
import React, { useState } from 'react';
import { X, Download, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAttendance } from '@/hooks/useAttendance';
import jsPDF from 'jspdf';

interface WorkerSalaryModalProps {
  worker: any;
  onClose: () => void;
}

const WorkerSalaryModal: React.FC<WorkerSalaryModalProps> = ({ worker, onClose }) => {
  const { attendanceRecords, advanceRecords } = useAttendance();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getWorkerAttendance = () => {
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date + 'T00:00:00');
      const recordMonth = recordDate.getMonth() + 1;
      const recordYear = recordDate.getFullYear();
      return record.worker_id === worker.id && 
             recordMonth === selectedMonth && 
             recordYear === selectedYear;
    });
  };

  const getWorkerAdvances = () => {
    return advanceRecords.filter(record => {
      const recordDate = new Date(record.date + 'T00:00:00');
      const recordMonth = recordDate.getMonth() + 1;
      const recordYear = recordDate.getFullYear();
      return record.worker_id === worker.id && 
             recordMonth === selectedMonth && 
             recordYear === selectedYear;
    });
  };

  const workerAttendance = getWorkerAttendance();
  const workerAdvances = getWorkerAdvances();
  
  const presentDays = workerAttendance.filter(record => record.status === 'present').length;
  const totalSalary = presentDays * worker.daily_wage;
  const totalAdvances = workerAdvances.reduce((sum, advance) => sum + advance.amount, 0);
  const netSalary = totalSalary - totalAdvances;

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Salary Report', 20, 20);
    
    // Worker Details
    doc.setFontSize(14);
    doc.text(`Worker: ${worker.name}`, 20, 40);
    doc.text(`Month: ${monthNames[selectedMonth - 1]} ${selectedYear}`, 20, 50);
    doc.text(`Daily Wage: ₹${worker.daily_wage}`, 20, 60);
    
    // Attendance Summary
    doc.setFontSize(12);
    doc.text('Attendance Summary:', 20, 80);
    doc.text(`Present Days: ${presentDays}`, 30, 90);
    doc.text(`Gross Salary: ₹${totalSalary}`, 30, 100);
    
    // Advances
    if (workerAdvances.length > 0) {
      doc.text('Advance Payments:', 20, 120);
      let yPos = 130;
      workerAdvances.forEach((advance) => {
        doc.text(`${advance.date}: ₹${advance.amount} - ${advance.description || 'No description'}`, 30, yPos);
        yPos += 10;
      });
      doc.text(`Total Advances: ₹${totalAdvances}`, 30, yPos + 10);
      yPos += 30;
    } else {
      doc.text('No advance payments', 20, 120);
    }
    
    // Net Salary
    doc.setFontSize(14);
    doc.text(`Net Salary: ₹${netSalary}`, 20, workerAdvances.length > 0 ? 180 : 150);
    
    doc.save(`${worker.name}_salary_${monthNames[selectedMonth - 1]}_${selectedYear}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
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
              <h2 className="text-xl font-bold text-gray-800">{worker.name}</h2>
              <p className="text-gray-600">Salary Report</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Month/Year Selection */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
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

          {/* Salary Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Attendance Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Present Days:</span>
                  <span className="font-semibold text-blue-800">{presentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Daily Wage:</span>
                  <span className="font-semibold text-blue-800">₹{worker.daily_wage}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-blue-700 font-semibold">Gross Salary:</span>
                  <span className="font-bold text-blue-800">₹{totalSalary}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Advance Payments</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {workerAdvances.length > 0 ? (
                  workerAdvances.map((advance) => (
                    <div key={advance.id} className="flex justify-between text-sm">
                      <span className="text-red-700">{advance.date}:</span>
                      <span className="font-semibold text-red-800">₹{advance.amount}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-red-600 text-sm">No advance payments</p>
                )}
              </div>
              <div className="flex justify-between border-t border-red-200 pt-2 mt-2">
                <span className="text-red-700 font-semibold">Total Advances:</span>
                <span className="font-bold text-red-800">₹{totalAdvances}</span>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Net Salary</h3>
            <div className="text-3xl font-bold text-green-800">₹{netSalary}</div>
            <div className="text-sm text-green-600 mt-1">
              {monthNames[selectedMonth - 1]} {selectedYear}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button onClick={generatePDF} className="bg-blue-500 hover:bg-blue-600">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerSalaryModal;
