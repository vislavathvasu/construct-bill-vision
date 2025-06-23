
import React, { useState } from 'react';
import { Plus, Receipt, Search, BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MaterialCard from '@/components/MaterialCard';
import BillCard from '@/components/BillCard';
import AddBillForm from '@/components/AddBillForm';
import { materialTypes } from '@/data/materials';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [bills, setBills] = useState([
    {
      id: '1',
      shopName: 'Sharma Hardware Store',
      material: 'Water Pipes',
      amount: 2500,
      date: '23/06/2025',
      location: 'Main Market',
      materialIcon: materialTypes[0].icon,
    },
    {
      id: '2',
      shopName: 'City Cement Suppliers',
      material: 'Cement',
      amount: 8500,
      date: '22/06/2025',
      materialIcon: materialTypes[1].icon,
    },
    {
      id: '3',
      shopName: 'Steel World',
      material: 'Steel/Rebar',
      amount: 15000,
      date: '21/06/2025',
      location: 'Industrial Area',
      materialIcon: materialTypes[2].icon,
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const filteredBills = bills.filter(bill => 
    bill.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBill = (newBill: any) => {
    setBills([newBill, ...bills]);
    setCurrentView('bills');
  };

  const handleDeleteBill = (billId: string) => {
    setBills(bills.filter(bill => bill.id !== billId));
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Construction Bills Manager</h1>
        <p className="text-xl text-gray-600">Track your construction material purchases</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          {bills.slice(0, 4).map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onView={() => console.log('View bill:', bill.id)}
              onDelete={() => handleDeleteBill(bill.id)}
            />
          ))}
        </div>
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBills.map((bill) => (
          <BillCard
            key={bill.id}
            bill={bill}
            onView={() => console.log('View bill:', bill.id)}
            onDelete={() => handleDeleteBill(bill.id)}
          />
        ))}
      </div>

      {filteredBills.length === 0 && (
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
            <Button 
              onClick={() => setCurrentView('add-bill')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={16} className="mr-2" />
              Add Bill
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'bills' && renderBillsList()}
        {currentView === 'add-bill' && (
          <AddBillForm
            onSave={handleAddBill}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
