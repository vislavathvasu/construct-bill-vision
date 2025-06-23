import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Save, X } from 'lucide-react';
import MaterialCard from './MaterialCard';
import { materialTypes } from '../data/materials';
import { Bill } from '@/types/bill';

interface AddBillFormProps {
  onSave: (bill: Bill) => void;
  onCancel: () => void;
}

const AddBillForm: React.FC<AddBillFormProps> = ({ onSave, onCancel }) => {
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [shopName, setShopName] = useState('');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !shopName || !amount) return;

    const materialData = materialTypes.find(m => m.id === selectedMaterial);
    const newBill: Bill = {
      id: Date.now().toString(),
      shopName,
      material: materialData?.name || '',
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString('en-IN'),
      location: location || undefined,
      materialIcon: materialData?.icon!,
    };

    onSave(newBill);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Bill</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Material Selection */}
        <div>
          <Label className="text-lg font-semibold mb-4 block">Select Material</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {materialTypes.map((material) => (
              <MaterialCard
                key={material.id}
                icon={material.icon}
                name={material.name}
                onClick={() => setSelectedMaterial(material.id)}
                isSelected={selectedMaterial === material.id}
              />
            ))}
          </div>
        </div>

        {/* Bill Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="shopName" className="text-lg font-semibold">Shop Name</Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter shop name"
              className="mt-2 text-lg p-4"
              required
            />
          </div>
          <div>
            <Label htmlFor="amount" className="text-lg font-semibold">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-2 text-lg p-4"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-lg font-semibold">Location (Optional)</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="mt-2 text-lg p-4"
          />
        </div>

        {/* Photo Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Camera size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Take a photo of your bill</p>
          <Button type="button" variant="outline">
            <Camera size={16} className="mr-2" />
            Capture Bill Photo
          </Button>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-3"
            disabled={!selectedMaterial || !shopName || !amount}
          >
            <Save size={20} className="mr-2" />
            Save Bill
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBillForm;
