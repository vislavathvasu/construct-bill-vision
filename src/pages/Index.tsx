
import React, { useState } from 'react';
import { Plus, Receipt, Search, BarChart3, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaterialCard from '@/components/MaterialCard';
import BillCard from '@/components/BillCard';
import AddBillForm from '@/components/AddBillForm';
import AuthForm from '@/components/AuthForm';
import { materialTypes } from '@/data/materials';
import { useAuth } from '@/hooks/useAuth';
import { useBills } from '@/hooks/useBills';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { bills, loading: billsLoading, deleteBill } = useBills();
  const [currentView, setCurrentView] = useState('dashboard');
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

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const filteredBills = bills.filter(bill => 
    bill.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteBill = (billId: string) => {
    deleteBill(billId);
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Construction Bills Manager</h1>
        <p className="text-xl text-gray-600">Track your construction material purchases</p>
        <p className="text-sm text-gray-500 mt-2">Welcome, {user.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
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
              <p className="text-green-100">Total Amount</p>
              <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <BarChart3 size={48} className="text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">This Month</p>
              <p className="text-3xl font-bold">{bills.length}</p>
            </div>
            <Calendar size={48} className="text-purple-200" />
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
              // Convert database bill to display format
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
                  onView={() => console.log('View bill:', bill.id)}
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search bills by shop name or material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-lg py-3"
        />
      </div>

      {/* Bills Grid */}
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
                onView={() => console.log('View bill:', bill.id)}
                onDelete={() => handleDeleteBill(bill.id)}
              />
            );
          })}
        </div>
      )}

      {filteredBills.length === 0 && !billsLoading && (
        <div className="text-center py-12">
          <Receipt size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-500">No bills found</p>
        </div>
      )}
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
                  All Bills
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
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'bills' && renderBillsList()}
        {currentView === 'add-bill' && (
          <AddBillForm
            onSave={() => setCurrentView('dashboard')}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
