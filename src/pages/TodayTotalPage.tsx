
import React from 'react';
import { ArrowLeft, Receipt, Users, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useBills } from '@/hooks/useBills';
import { useWorkers } from '@/hooks/useWorkers';
import { materialTypes } from '@/data/materials';
import BillCard from '@/components/BillCard';
import ExpenditureRecordCard from '@/components/ExpenditureRecordCard';

const TodayTotalPage = () => {
  const navigate = useNavigate();
  const { bills } = useBills();
  const { expenditureRecords } = useWorkers();

  const today = new Date().toISOString().split('T')[0];
  
  // Filter today's bills and expenditures
  const todayBills = bills.filter(bill => bill.date === today);
  const todayExpenditures = expenditureRecords.filter(record => record.date === today);
  
  const todayBillsTotal = todayBills.reduce((sum, bill) => sum + bill.amount, 0);
  const todayExpendituresTotal = todayExpenditures.reduce((sum, record) => sum + record.amount, 0);
  const grandTotal = todayBillsTotal + todayExpendituresTotal;

  const handleWorkerClick = (workerId: string) => {
    // Navigate back to dashboard and show worker details
    navigate('/', { state: { showWorkerId: workerId } });
  };

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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Today's Total</h1>
              <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Bills Total</p>
                <p className="text-2xl sm:text-3xl font-bold">₹{todayBillsTotal.toLocaleString()}</p>
              </div>
              <Receipt size={32} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Expenditures Total</p>
                <p className="text-2xl sm:text-3xl font-bold">₹{todayExpendituresTotal.toLocaleString()}</p>
              </div>
              <Users size={32} className="text-orange-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Grand Total</p>
                <p className="text-2xl sm:text-3xl font-bold">₹{grandTotal.toLocaleString()}</p>
              </div>
              <DollarSign size={32} className="text-red-200" />
            </div>
          </div>
        </div>

        {/* Today's Bills Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Receipt size={24} className="text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Today's Bills ({todayBills.length})</h2>
          </div>
          
          {todayBills.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Receipt size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No bills recorded today</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {todayBills.map((bill) => {
                const materialType = materialTypes.find(m => m.name === bill.material);
                return (
                  <BillCard
                    key={bill.id}
                    bill={{
                      id: bill.id,
                      shopName: bill.shop_name,
                      material: bill.material,
                      amount: bill.amount,
                      date: new Date(bill.date).toLocaleDateString('en-IN'),
                      location: bill.location,
                      materialIcon: materialType?.icon || Receipt,
                    }}
                    onView={() => {/* Handle view if needed */}}
                    onDelete={() => {/* Handle delete if needed */}}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Today's Expenditures Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-orange-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Today's Expenditures ({todayExpenditures.length})</h2>
          </div>
          
          {todayExpenditures.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No expenditures recorded today</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {todayExpenditures.map((record) => (
                <ExpenditureRecordCard 
                  key={record.id} 
                  record={record}
                  onWorkerClick={handleWorkerClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayTotalPage;
