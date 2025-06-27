
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, User, Calendar } from 'lucide-react';
import { useBills } from '@/hooks/useBills';
import { useWorkers } from '@/hooks/useWorkers';
import { generateMonthlyPDF } from '@/utils/pdfGenerator';

const MonthlyReports: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { bills } = useBills();
  const { workers, expenditureRecords } = useWorkers();

  const handleDownloadPDF = () => {
    generateMonthlyPDF(bills, expenditureRecords, selectedMonth.toString(), selectedYear.toString());
  };

  const getWorkerMonthlyTotal = (workerId: string) => {
    return expenditureRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        return record.worker_id === workerId &&
               recordDate.getMonth() === selectedMonth - 1 &&
               recordDate.getFullYear() === selectedYear;
      })
      .reduce((sum, record) => sum + record.amount, 0);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Monthly Reports & Tracking</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="month" className="text-base font-semibold">Month</Label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full mt-1 p-3 border border-gray-300 rounded-md text-base h-12"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="year" className="text-base font-semibold">Year</Label>
            <Input
              id="year"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="mt-1 text-base p-3 h-12"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleDownloadPDF}
              className="w-full bg-blue-500 hover:bg-blue-600 h-12"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Worker Monthly Spending - {monthNames[selectedMonth - 1]} {selectedYear}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => {
            const monthlyTotal = getWorkerMonthlyTotal(worker.id);
            const workerRecords = expenditureRecords.filter(record => {
              const recordDate = new Date(record.date);
              return record.worker_id === worker.id &&
                     recordDate.getMonth() === selectedMonth - 1 &&
                     recordDate.getFullYear() === selectedYear;
            });

            return (
              <div key={worker.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {worker.photo_url ? (
                    <img 
                      src={worker.photo_url} 
                      alt="Worker"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-gray-500 sm:w-6 sm:h-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-base sm:text-lg truncate">{worker.name}</p>
                    <p className="text-sm text-gray-500 truncate">{worker.phone || 'No Phone'}</p>
                    <p className="text-sm text-gray-500">{workerRecords.length} payments</p>
                  </div>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-gray-600">Monthly Total</p>
                  <p className="text-lg sm:text-xl font-bold text-red-600">₹{monthlyTotal.toLocaleString()}</p>
                </div>
                
                {workerRecords.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Recent Payments:</p>
                    {workerRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex justify-between text-sm">
                        <span className="flex items-center min-w-0 flex-1">
                          <Calendar size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{new Date(record.date).toLocaleDateString('en-IN')}</span>
                        </span>
                        <span className="font-medium ml-2 flex-shrink-0">₹{record.amount}</span>
                      </div>
                    ))}
                    {workerRecords.length > 3 && (
                      <p className="text-xs text-gray-500">...and {workerRecords.length - 3} more</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReports;
