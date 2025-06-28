
import React, { useState } from 'react';
import { ArrowLeft, Users, DollarSign, Calendar, TrendingUp, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useBills } from '@/hooks/useBills';
import { useWorkers } from '@/hooks/useWorkers';

const TotalExpenditurePage = () => {
  const navigate = useNavigate();
  const { bills } = useBills();
  const { workers, expenditureRecords } = useWorkers();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate totals
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalExpenditures = expenditureRecords.reduce((sum, record) => sum + record.amount, 0);
  const grandTotal = totalBills + totalExpenditures;

  // Get current month data
  const currentMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getMonth() === selectedMonth && billDate.getFullYear() === selectedYear;
  });

  const currentMonthExpenditures = expenditureRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
  });

  const monthlyBillsTotal = currentMonthBills.reduce((sum, bill) => sum + bill.amount, 0);
  const monthlyExpendituresTotal = currentMonthExpenditures.reduce((sum, record) => sum + record.amount, 0);
  const monthlyTotal = monthlyBillsTotal + monthlyExpendituresTotal;

  // Worker spending breakdown
  const workerSpending = workers.map(worker => {
    const workerRecords = expenditureRecords.filter(record => record.worker_id === worker.id);
    const totalSpent = workerRecords.reduce((sum, record) => sum + record.amount, 0);
    const monthlySpent = workerRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
      })
      .reduce((sum, record) => sum + record.amount, 0);
    
    return {
      ...worker,
      totalSpent,
      monthlySpent,
      recordCount: workerRecords.length
    };
  }).filter(worker => worker.totalSpent > 0);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Total Expenditure</h1>
              <p className="text-sm text-gray-600">Complete spending overview</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Overall Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Bills</p>
                <p className="text-2xl sm:text-3xl font-bold">₹{totalBills.toLocaleString()}</p>
                <p className="text-blue-200 text-xs mt-1">{bills.length} bills</p>
              </div>
              <Receipt size={32} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Expenditures</p>
                <p className="text-2xl sm:text-3xl font-bold">₹{totalExpenditures.toLocaleString()}</p>
                <p className="text-orange-200 text-xs mt-1">{expenditureRecords.length} records</p>
              </div>
              <Users size={32} className="text-orange-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Grand Total</p>
                <p className="text-2xl sm:text-3xl font-bold">₹{grandTotal.toLocaleString()}</p>
                <p className="text-green-200 text-xs mt-1">All expenses</p>
              </div>
              <TrendingUp size={32} className="text-green-200" />
            </div>
          </div>
        </div>

        {/* Month Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Breakdown</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Receipt size={20} className="text-blue-600" />
              <h4 className="font-semibold text-gray-800">Monthly Bills</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{monthlyBillsTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{currentMonthBills.length} bills</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-orange-600" />
              <h4 className="font-semibold text-gray-800">Monthly Expenditures</h4>
            </div>
            <p className="text-2xl font-bold text-orange-600">₹{monthlyExpendituresTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{currentMonthExpenditures.length} records</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={20} className="text-green-600" />
              <h4 className="font-semibold text-gray-800">Monthly Total</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{monthlyTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{months[selectedMonth]} {selectedYear}</p>
          </div>
        </div>

        {/* Worker Spending Breakdown */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Worker Spending Breakdown</h3>
          {workerSpending.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No worker expenditures recorded</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workerSpending.map((worker) => (
                <div key={worker.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {worker.photo_url ? (
                      <img 
                        src={worker.photo_url} 
                        alt={worker.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{worker.name}</h4>
                      {worker.phone && (
                        <p className="text-sm text-gray-500">{worker.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="font-bold text-lg text-green-600">₹{worker.totalSpent.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold text-blue-600">₹{worker.monthlySpent.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-gray-500">Total Records</span>
                      <span className="text-xs font-medium text-gray-700">{worker.recordCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalExpenditurePage;
