
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
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Reports & Tracking</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="month">Month</Label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleDownloadPDF}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Worker Monthly Spending - {monthNames[selectedMonth - 1]} {selectedYear}
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={24} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{worker.phone || 'No Phone'}</p>
                    <p className="text-sm text-gray-500">{workerRecords.length} payments</p>
                  </div>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Total</p>
                  <p className="text-xl font-bold text-red-600">₹{monthlyTotal.toLocaleString()}</p>
                </div>
                
                {workerRecords.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Recent Payments:</p>
                    {workerRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(record.date).toLocaleDateString('en-IN')}
                        </span>
                        <span className="font-medium">₹{record.amount}</span>
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
