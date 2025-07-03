
import React, { useState } from 'react';
import { Calendar, FileText, DollarSign, MessageCircle, Edit, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useWorkers } from '@/hooks/useWorkers';
import { useBills } from '@/hooks/useBills';
import AuthForm from '@/components/AuthForm';
import AddWorkerForm from '@/components/AddWorkerForm';
import AddBillForm from '@/components/AddBillForm';
import AddExpenditureForm from '@/components/AddExpenditureForm';
import AddWageForm from '@/components/AddWageForm';
import AddAdvanceForm from '@/components/AddAdvanceForm';
import WorkerSalaryModal from '@/components/WorkerSalaryModal';
import WorkerDetailModal from '@/components/WorkerDetailModal';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { workers, loading: workersLoading, deleteWorker, expenditureRecords } = useWorkers();
  const { bills, loading: billsLoading, deleteBill } = useBills();

  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [showAddExpenditure, setShowAddExpenditure] = useState(false);
  const [showAddWage, setShowAddWage] = useState(false);
  const [showAddAdvance, setShowAddAdvance] = useState(false);
  const [selectedWorkerForSalary, setSelectedWorkerForSalary] = useState<any>(null);
  const [selectedWorkerForDetail, setSelectedWorkerForDetail] = useState<any>(null);

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

  const handleDeleteWorker = async (workerId: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await deleteWorker(workerId);
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const handleDeleteBill = async (billId: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await deleteBill(billId);
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  const handleWhatsAppMessage = (workerPhone: string) => {
    if (workerPhone) {
      const message = encodeURIComponent("Hello! This is a message from your construction management system.");
      window.open(`https://wa.me/${workerPhone}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">Construction Manager</h1>
            <div className="flex space-x-2">
              <Button onClick={() => navigate('/attendance')} variant="outline" size="sm">
                <Calendar size={16} className="mr-2" />
                Attendance
              </Button>
              <Button onClick={() => navigate('/today-total')} variant="outline" size="sm">
                <DollarSign size={16} className="mr-2" />
                Today's Total
              </Button>
              <Button onClick={() => navigate('/total-expenditure')} variant="outline" size="sm">
                <FileText size={16} className="mr-2" />
                Total Expenditure
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Button onClick={() => setShowAddWorker(true)} className="h-20 flex flex-col space-y-2">
            <User size={24} />
            <span>Add Worker</span>
          </Button>
          <Button onClick={() => setShowAddBill(true)} className="h-20 flex flex-col space-y-2">
            <FileText size={24} />
            <span>Add Bill</span>
          </Button>
          <Button onClick={() => setShowAddExpenditure(true)} className="h-20 flex flex-col space-y-2">
            <DollarSign size={24} />
            <span>Add Expenditure</span>
          </Button>
          <Button onClick={() => setShowAddWage(true)} className="h-20 flex flex-col space-y-2">
            <Calendar size={24} />
            <span>Add Wage</span>
          </Button>
          <Button onClick={() => setShowAddAdvance(true)} className="h-20 flex flex-col space-y-2">
            <DollarSign size={24} />
            <span>Add Advance</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workers Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Workers</h2>
            {workersLoading ? (
              <div className="text-center py-8">Loading workers...</div>
            ) : (
              <div className="space-y-4">
                {workers.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
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
                          {worker.phone && (
                            <p className="text-xs text-gray-500">{worker.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => setSelectedWorkerForSalary(worker)}
                          variant="outline"
                          size="sm"
                          className="p-1 h-6 w-6"
                          title="View Salary"
                        >
                          <DollarSign size={10} />
                        </Button>
                        
                        {worker.phone && (
                          <Button
                            onClick={() => handleWhatsAppMessage(worker.phone)}
                            variant="outline"
                            size="sm"
                            className="p-1 h-6 w-6 text-green-600 hover:text-green-700"
                            title="WhatsApp"
                          >
                            <MessageCircle size={10} />
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => navigate(`/edit-worker/${worker.id}`)}
                          variant="outline"
                          size="sm"
                          className="p-1 h-6 w-6 text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit size={10} />
                        </Button>
                        
                        <Button
                          onClick={() => handleDeleteWorker(worker.id)}
                          variant="outline"
                          size="sm"
                          className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash size={10} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bills & Expenditures Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bills & Expenditures</h2>
            {billsLoading ? (
              <div className="text-center py-8">Loading bills...</div>
            ) : (
              <div className="space-y-4">
                {bills.slice(0, 10).map((bill) => (
                  <div key={bill.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{bill.material}</h3>
                          <span className="text-lg font-bold text-green-600">₹{bill.amount}</span>
                        </div>
                        <p className="text-sm text-gray-600">{bill.shop_name}</p>
                        <p className="text-xs text-gray-500">{bill.date}</p>
                        {bill.location && (
                          <p className="text-xs text-gray-500">{bill.location}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-1 ml-4">
                        <Button
                          onClick={() => navigate(`/edit-bill/${bill.id}`)}
                          variant="outline"
                          size="sm"
                          className="p-1 h-6 w-6 text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit size={10} />
                        </Button>
                        
                        <Button
                          onClick={() => handleDeleteBill(bill.id)}
                          variant="outline"
                          size="sm"
                          className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash size={10} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddWorker && (
        <AddWorkerForm 
          onSave={() => setShowAddWorker(false)} 
          onCancel={() => setShowAddWorker(false)} 
        />
      )}
      {showAddBill && (
        <AddBillForm 
          onSave={() => setShowAddBill(false)} 
          onCancel={() => setShowAddBill(false)} 
        />
      )}
      {showAddExpenditure && (
        <AddExpenditureForm 
          onSave={() => setShowAddExpenditure(false)} 
          onCancel={() => setShowAddExpenditure(false)} 
        />
      )}
      {showAddWage && (
        <AddWageForm 
          onSave={() => setShowAddWage(false)} 
          onCancel={() => setShowAddWage(false)} 
        />
      )}
      {showAddAdvance && (
        <AddAdvanceForm 
          onSave={() => setShowAddAdvance(false)} 
          onCancel={() => setShowAddAdvance(false)} 
        />
      )}
      {selectedWorkerForSalary && (
        <WorkerSalaryModal
          worker={selectedWorkerForSalary}
          onClose={() => setSelectedWorkerForSalary(null)}
        />
      )}
      {selectedWorkerForDetail && (
        <WorkerDetailModal
          worker={selectedWorkerForDetail}
          expenditureRecords={expenditureRecords || []}
          onClose={() => setSelectedWorkerForDetail(null)}
        />
      )}
    </div>
  );
};

export default Index;
