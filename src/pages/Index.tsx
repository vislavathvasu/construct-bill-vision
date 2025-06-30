import React, { useState } from 'react';
import { Plus, Users, FileText, DollarSign, Calendar, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddWorkerForm from '@/components/AddWorkerForm';
import WorkerCard from '@/components/WorkerCard';
import AddBillForm from '@/components/AddBillForm';
import BillCard from '@/components/BillCard';
import WorkerDetailModal from '@/components/WorkerDetailModal';
import WorkerSalaryModal from '@/components/WorkerSalaryModal';
import BillViewModal from '@/components/BillViewModal';
import { useWorkers, Worker } from '@/hooks/useWorkers';
import { useBills, Bill } from '@/hooks/useBills';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { workers, loading: workersLoading, deleteWorker } = useWorkers();
  const { bills, loading: billsLoading, deleteBill } = useBills();
  const { user, loading: authLoading } = useAuth();
  
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showWorkerDetail, setShowWorkerDetail] = useState(false);
  const [showWorkerSalary, setShowWorkerSalary] = useState(false);
  const [showBillDetail, setShowBillDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'workers' | 'bills'>('workers');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredBills = bills.filter(bill =>
    bill.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorker(worker);
    setShowWorkerDetail(true);
  };

  const handleViewSalary = (worker: Worker) => {
    setSelectedWorker(worker);
    setShowWorkerSalary(true);
  };

  const handleViewAttendance = (worker: Worker) => {
    // Navigate to attendance page with worker filter
    navigate('/attendance');
  };

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill);
    setShowBillDetail(true);
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      await deleteWorker(workerId);
    }
  };

  const handleDeleteBill = async (billId: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      await deleteBill(billId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Construction Manager</h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={() => navigate('/attendance')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                <UserCheck size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Attendance</span>
              </Button>
              <Button
                onClick={() => navigate('/today-total')}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <DollarSign size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Today Total</span>
              </Button>
              <Button
                onClick={() => navigate('/total-expenditure')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
                size="sm"
              >
                <FileText size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Total Exp</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 max-w-md mx-auto">
          <Button
            onClick={() => setActiveTab('workers')}
            className={`flex-1 h-10 ${
              activeTab === 'workers'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            }`}
            variant="ghost"
          >
            <Users size={16} className="mr-2" />
            Workers
          </Button>
          <Button
            onClick={() => setActiveTab('bills')}
            className={`flex-1 h-10 ${
              activeTab === 'bills'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            }`}
            variant="ghost"
          >
            <FileText size={16} className="mr-2" />
            Bills
          </Button>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Input
            placeholder={activeTab === 'workers' ? 'Search workers...' : 'Search bills...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button
            onClick={() => activeTab === 'workers' ? setShowAddWorker(true) : setShowAddBill(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap"
          >
            <Plus size={20} className="mr-2" />
            Add {activeTab === 'workers' ? 'Worker' : 'Bill'}
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'workers' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workersLoading ? (
              <div className="col-span-full text-center py-12">Loading workers...</div>
            ) : filteredWorkers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                {searchTerm ? 'No workers found matching your search.' : 'No workers added yet. Click "Add Worker" to get started.'}
              </div>
            ) : (
              filteredWorkers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onClick={() => handleWorkerClick(worker)}
                  onDelete={() => handleDeleteWorker(worker.id)}
                  onViewSalary={() => handleViewSalary(worker)}
                  onViewAttendance={() => handleViewAttendance(worker)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {billsLoading ? (
              <div className="col-span-full text-center py-12">Loading bills...</div>
            ) : filteredBills.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                {searchTerm ? 'No bills found matching your search.' : 'No bills added yet. Click "Add Bill" to get started.'}
              </div>
            ) : (
              filteredBills.map((bill) => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  onClick={() => handleBillClick(bill)}
                  onDelete={() => handleDeleteBill(bill.id)}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AddWorkerForm
            onSave={() => setShowAddWorker(false)}
            onCancel={() => setShowAddWorker(false)}
          />
        </div>
      )}

      {showAddBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AddBillForm
            onSave={() => setShowAddBill(false)}
            onCancel={() => setShowAddBill(false)}
          />
        </div>
      )}

      {showWorkerDetail && selectedWorker && (
        <WorkerDetailModal
          worker={selectedWorker}
          onClose={() => {
            setShowWorkerDetail(false);
            setSelectedWorker(null);
          }}
        />
      )}

      {showWorkerSalary && selectedWorker && (
        <WorkerSalaryModal
          worker={selectedWorker}
          onClose={() => {
            setShowWorkerSalary(false);
            setSelectedWorker(null);
          }}
        />
      )}

      {showBillDetail && selectedBill && (
        <BillViewModal
          bill={selectedBill}
          onClose={() => {
            setShowBillDetail(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
