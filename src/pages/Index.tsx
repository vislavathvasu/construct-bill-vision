
import React, { useState } from 'react';
import { Plus, Receipt, Search, BarChart3, Calendar, LogOut, Users, DollarSign, FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaterialCard from '@/components/MaterialCard';
import BillCard from '@/components/BillCard';
import BillViewModal from '@/components/BillViewModal';
import AddBillForm from '@/components/AddBillForm';
import AddExpenditureForm from '@/components/AddExpenditureForm';
import AddWorkerForm from '@/components/AddWorkerForm';
import WorkerCard from '@/components/WorkerCard';
import WorkerDetailModal from '@/components/WorkerDetailModal';
import ExpenditureRecordCard from '@/components/ExpenditureRecordCard';
import MonthlyReports from '@/components/MonthlyReports';
import DateRangeFilter from '@/components/DateRangeFilter';
import AuthForm from '@/components/AuthForm';
import { materialTypes } from '@/data/materials';
import { useAuth } from '@/hooks/useAuth';
import { useBills, DatabaseBill } from '@/hooks/useBills';
import { useWorkers, Worker } from '@/hooks/useWorkers';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { bills, loading: billsLoading, deleteBill } = useBills();
  const { workers, expenditureRecords, loading: workersLoading, deleteWorker } = useWorkers();
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [workerSearchTerm, setWorkerSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<DatabaseBill | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const today = new Date().toISOString().split('T')[0];
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalExpenditures = expenditureRecords.reduce((sum, record) => sum + record.amount, 0);
  const todayExpenditures = expenditureRecords
    .filter(record => record.date === today)
    .reduce((sum, record) => sum + record.amount, 0);
  const todayBills = bills
    .filter(bill => bill.date === today)
    .reduce((sum, bill) => sum + bill.amount, 0);
  const todayTotal = todayBills + todayExpenditures;

  // Filter bills by search term and date range
  let filteredBills = bills.filter(bill => 
    bill.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (startDate || endDate) {
    filteredBills = filteredBills.filter(bill => {
      const billDate = new Date(bill.date);
      if (startDate && billDate < startDate) return false;
      if (endDate && billDate > endDate) return false;
      return true;
    });
  }

  // Filter workers by search term
  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(workerSearchTerm.toLowerCase()) ||
    (worker.phone && worker.phone.includes(workerSearchTerm))
  );

  const handleDeleteBill = (billId: string) => {
    deleteBill(billId);
  };

  const handleDeleteWorker = (workerId: string) => {
    deleteWorker(workerId);
  };

  const handleViewBill = (bill: DatabaseBill) => {
    setSelectedBill(bill);
  };

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorker(worker);
  };

  const handleWorkerClickById = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (worker) {
      setSelectedWorker(worker);
    }
  };

  const handleStatCardClick = (type: string) => {
    switch (type) {
      case 'bills':
        setCurrentView('bills');
        break;
      case 'workers':
        setCurrentView('workers');
        break;
      case 'reports':
        setCurrentView('reports');
        break;
      case 'today-total':
        navigate('/today-total');
        break;
      case 'total-expenditure':
        navigate('/total-expenditure');
        break;
      default:
        break;
    }
  };

  const renderReportsView = () => {
    return <MonthlyReports />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile-First Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                Construction Manager
              </h1>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('dashboard')}
                  size="sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'bills' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('bills')}
                  size="sm"
                >
                  Bills
                </Button>
                <Button
                  variant={currentView === 'workers' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('workers')}
                  size="sm"
                >
                  Workers
                </Button>
                <Button
                  variant={currentView === 'reports' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('reports')}
                  size="sm"
                >
                  <FileText size={16} className="mr-1" />
                  Reports
                </Button>
              </div>
              <Button 
                onClick={() => setCurrentView('add-bill')}
                className="bg-blue-500 hover:bg-blue-600"
                size="sm"
              >
                <Plus size={16} className="mr-1" />
                Add Bill
              </Button>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut size={16} className="mr-1" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === 'bills' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('bills');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Bills
              </Button>
              <Button
                variant={currentView === 'workers' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('workers');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                Workers
              </Button>
              <Button
                variant={currentView === 'reports' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('reports');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                <FileText size={16} className="mr-2" />
                Reports
              </Button>
              <div className="border-t pt-2 space-y-2">
                <Button 
                  onClick={() => {
                    setCurrentView('add-bill');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  <Plus size={16} className="mr-2" />
                  Add Bill
                </Button>
                <Button 
                  onClick={signOut} 
                  variant="outline"
                  className="w-full justify-start"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Construction Manager</h1>
              <p className="text-lg sm:text-xl text-gray-600">Track bills, workers, and daily expenditures</p>
              <p className="text-sm text-gray-500 mt-2 truncate">Welcome, {user.email}</p>
            </div>

            {/* Stats Cards - Mobile-First Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow active:scale-95"
                onClick={() => handleStatCardClick('bills')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Bills</p>
                    <p className="text-2xl sm:text-3xl font-bold">{bills.length}</p>
                  </div>
                  <Receipt size={36} className="text-blue-200" />
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow active:scale-95"
                onClick={() => handleStatCardClick('bills')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Bill Amount</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
                  </div>
                  <BarChart3 size={36} className="text-green-200" />
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow active:scale-95"
                onClick={() => handleStatCardClick('workers')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Workers</p>
                    <p className="text-2xl sm:text-3xl font-bold">{workers.length}</p>
                  </div>
                  <Users size={36} className="text-purple-200" />
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow active:scale-95"
                onClick={() => handleStatCardClick('total-expenditure')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Expenditures</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold">₹{totalExpenditures.toLocaleString()}</p>
                  </div>
                  <DollarSign size={36} className="text-orange-200" />
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow active:scale-95"
                onClick={() => handleStatCardClick('today-total')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Today's Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold">₹{todayTotal.toLocaleString()}</p>
                  </div>
                  <Calendar size={36} className="text-red-200" />
                </div>
              </div>
            </div>

            {/* Quick Material Access */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Material Selection</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {materialTypes.slice(0, 10).map((material) => (
                  <MaterialCard
                    key={material.id}
                    icon={material.icon}
                    name={material.name}
                    onClick={() => setCurrentView('add-bill')}
                  />
                ))}
              </div>
            </div>

            {/* Recent Bills */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Bills</h2>
                <Button 
                  onClick={() => setCurrentView('bills')}
                  variant="outline"
                  className="self-start sm:self-auto"
                >
                  View All Bills
                </Button>
              </div>
              {billsLoading ? (
                <div className="text-center py-8">Loading bills...</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {bills.slice(0, 4).map((bill) => {
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
                        onView={() => handleViewBill(bill)}
                        onDelete={() => handleDeleteBill(bill.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Expenditure Records */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recent Expenditure Records</h2>
                <Button 
                  onClick={() => setCurrentView('workers')}
                  variant="outline"
                  className="self-start sm:self-auto"
                >
                  View All Records
                </Button>
              </div>
              {workersLoading ? (
                <div className="text-center py-8">Loading expenditure records...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {expenditureRecords.slice(0, 6).map((record) => (
                    <ExpenditureRecordCard 
                      key={record.id} 
                      record={record}
                      onWorkerClick={handleWorkerClickById}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'bills' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">All Bills</h2>
              <Button 
                onClick={() => setCurrentView('add-bill')}
                className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
                size="lg"
              >
                <Plus size={20} className="mr-2" />
                Add New Bill
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search bills by shop name or material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base sm:text-lg py-3 sm:py-4"
              />
            </div>

            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClear={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            />

            {billsLoading ? (
              <div className="text-center py-12">Loading bills...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredBills.map((bill) => {
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
                      onView={() => handleViewBill(bill)}
                      onDelete={() => handleDeleteBill(bill.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentView === 'workers' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Workers & Expenditures</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setCurrentView('add-expenditure')}
                  className="bg-blue-500 hover:bg-blue-600"
                  size="lg"
                >
                  <DollarSign size={20} className="mr-2" />
                  Record Expenditure
                </Button>
                <Button 
                  onClick={() => setCurrentView('add-worker')}
                  className="bg-green-500 hover:bg-green-600"
                  size="lg"
                >
                  <Plus size={20} className="mr-2" />
                  Add Worker
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search workers by name or phone..."
                value={workerSearchTerm}
                onChange={(e) => setWorkerSearchTerm(e.target.value)}
                className="pl-10 text-base sm:text-lg py-3 sm:py-4"
              />
            </div>

            {workersLoading ? (
              <div className="text-center py-12">Loading workers...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredWorkers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      onClick={() => handleWorkerClick(worker)}
                      onDelete={() => handleDeleteWorker(worker.id)}
                    />
                  ))}
                </div>

                <div className="mt-8 sm:mt-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Recent Expenditure Records</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {expenditureRecords.slice(0, 6).map((record) => (
                      <ExpenditureRecordCard 
                        key={record.id} 
                        record={record}
                        onWorkerClick={handleWorkerClickById}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'reports' && renderReportsView()}

        {currentView === 'add-bill' && (
          <AddBillForm
            onSave={() => setCurrentView('dashboard')}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'add-worker' && (
          <AddWorkerForm
            onSave={() => setCurrentView('workers')}
            onCancel={() => setCurrentView('workers')}
          />
        )}

        {currentView === 'add-expenditure' && (
          <AddExpenditureForm
            onSave={() => setCurrentView('workers')}
            onCancel={() => setCurrentView('workers')}
          />
        )}
      </main>

      {/* Modals */}
      {selectedBill && (
        <BillViewModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}

      {selectedWorker && (
        <WorkerDetailModal
          worker={selectedWorker}
          expenditureRecords={expenditureRecords}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </div>
  );
};

export default Index;
