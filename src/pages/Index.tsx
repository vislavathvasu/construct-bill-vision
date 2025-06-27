import React, { useState } from 'react';
import { Plus, Receipt, Search, BarChart3, Calendar, LogOut, Users, DollarSign, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaterialCard from '@/components/MaterialCard';
import BillCard from '@/components/BillCard';
import BillViewModal from '@/components/BillViewModal';
import AddBillForm from '@/components/AddBillForm';
import EditBillForm from '@/components/EditBillForm';
import AddWorkerForm from '@/components/AddWorkerForm';
import AddExpenditureForm from '@/components/AddExpenditureForm';
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
  const [editingBill, setEditingBill] = useState<DatabaseBill | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const handleEditBill = (bill: DatabaseBill) => {
    setEditingBill(bill);
  };

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorker(worker);
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
      default:
        break;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Construction Manager</h1>
        <p className="text-xl text-gray-600">Track bills, workers, and daily expenditures</p>
        <p className="text-sm text-gray-500 mt-2">Welcome, {user.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Bills</p>
              <p className="text-3xl font-bold">{bills.length}</p>
            </div>
            <Receipt size={48} className="text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Bill Amount</p>
              <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <BarChart3 size={48} className="text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Workers</p>
              <p className="text-3xl font-bold">{workers.length}</p>
            </div>
            <Users size={48} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Expenditures</p>
              <p className="text-3xl font-bold">₹{totalExpenditures.toLocaleString()}</p>
            </div>
            <DollarSign size={48} className="text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Today's Total</p>
              <p className="text-3xl font-bold">₹{todayTotal.toLocaleString()}</p>
            </div>
            <Calendar size={48} className="text-red-200" />
          </div>
        </div>
      </div>

      {/* Quick Material Access */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Material Selection</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Bills</h2>
          <Button 
            onClick={() => setCurrentView('bills')}
            variant="outline"
          >
            View All Bills
          </Button>
        </div>
        {billsLoading ? (
          <div className="text-center py-8">Loading bills...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
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
                  onEdit={() => handleEditBill(bill)}
                  onDelete={() => handleDeleteBill(bill.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderBillsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">All Bills</h2>
        <Button 
          onClick={() => setCurrentView('add-bill')}
          className="bg-green-500 hover:bg-green-600"
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
          className="pl-10 text-lg py-3"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                onEdit={() => handleEditBill(bill)}
                onDelete={() => handleDeleteBill(bill.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWorkersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Workers & Expenditures</h2>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setCurrentView('add-expenditure')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <DollarSign size={20} className="mr-2" />
            Record Expenditure
          </Button>
          <Button 
            onClick={() => setCurrentView('add-worker')}
            className="bg-green-500 hover:bg-green-600"
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
          className="pl-10 text-lg py-3"
        />
      </div>

      {workersLoading ? (
        <div className="text-center py-12">Loading workers...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onClick={() => handleWorkerClick(worker)}
                onDelete={() => handleDeleteWorker(worker.id)}
              />
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Expenditure Records</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expenditureRecords.slice(0, 6).map((record) => (
                <ExpenditureRecordCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderReportsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Monthly Reports</h2>
      </div>
      <MonthlyReports />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">Construction Manager</h1>
              <div className="flex space-x-4">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'bills' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('bills')}
                >
                  Bills
                </Button>
                <Button
                  variant={currentView === 'workers' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('workers')}
                >
                  Workers
                </Button>
                <Button
                  variant={currentView === 'reports' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('reports')}
                >
                  <FileText size={16} className="mr-2" />
                  Reports
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setCurrentView('add-bill')}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus size={16} className="mr-2" />
                Add Bill
              </Button>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Construction Manager</h1>
              <p className="text-xl text-gray-600">Track bills, workers, and daily expenditures</p>
              <p className="text-sm text-gray-500 mt-2">Welcome, {user.email}</p>
            </div>

            {/* Stats Cards - Now clickable */}
            <div className="grid md:grid-cols-5 gap-6">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleStatCardClick('bills')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Bills</p>
                    <p className="text-3xl font-bold">{bills.length}</p>
                  </div>
                  <Receipt size={48} className="text-blue-200" />
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleStatCardClick('bills')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Bill Amount</p>
                    <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
                  </div>
                  <BarChart3 size={48} className="text-green-200" />
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleStatCardClick('workers')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Workers</p>
                    <p className="text-3xl font-bold">{workers.length}</p>
                  </div>
                  <Users size={48} className="text-purple-200" />
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleStatCardClick('workers')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Total Expenditures</p>
                    <p className="text-3xl font-bold">₹{totalExpenditures.toLocaleString()}</p>
                  </div>
                  <DollarSign size={48} className="text-orange-200" />
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleStatCardClick('reports')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Today's Total</p>
                    <p className="text-3xl font-bold">₹{todayTotal.toLocaleString()}</p>
                  </div>
                  <Calendar size={48} className="text-red-200" />
                </div>
              </div>
            </div>

            {/* Quick Material Access */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Material Selection</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recent Bills</h2>
                <Button 
                  onClick={() => setCurrentView('bills')}
                  variant="outline"
                >
                  View All Bills
                </Button>
              </div>
              {billsLoading ? (
                <div className="text-center py-8">Loading bills...</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
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
                        onEdit={() => handleEditBill(bill)}
                        onDelete={() => handleDeleteBill(bill.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'bills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">All Bills</h2>
              <Button 
                onClick={() => setCurrentView('add-bill')}
                className="bg-green-500 hover:bg-green-600"
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
                className="pl-10 text-lg py-3"
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      onEdit={() => handleEditBill(bill)}
                      onDelete={() => handleDeleteBill(bill.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentView === 'workers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Workers & Expenditures</h2>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setCurrentView('add-expenditure')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <DollarSign size={20} className="mr-2" />
                  Record Expenditure
                </Button>
                <Button 
                  onClick={() => setCurrentView('add-worker')}
                  className="bg-green-500 hover:bg-green-600"
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
                className="pl-10 text-lg py-3"
              />
            </div>

            {workersLoading ? (
              <div className="text-center py-12">Loading workers...</div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredWorkers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      onClick={() => handleWorkerClick(worker)}
                      onDelete={() => handleDeleteWorker(worker.id)}
                    />
                  ))}
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Expenditure Records</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {expenditureRecords.slice(0, 6).map((record) => (
                      <ExpenditureRecordCard key={record.id} record={record} />
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

      {editingBill && (
        <EditBillForm
          bill={editingBill}
          onSave={() => {
            setEditingBill(null);
            setCurrentView('bills');
          }}
          onCancel={() => setEditingBill(null)}
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
