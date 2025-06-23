
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, User } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useWorkers } from '@/hooks/useWorkers';

interface AddWorkerFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const AddWorkerForm: React.FC<AddWorkerFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [dailyWage, setDailyWage] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { addWorker } = useWorkers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      await addWorker({
        name,
        daily_wage: dailyWage ? parseFloat(dailyWage) : undefined,
        phone: phone || undefined,
        address: address || undefined,
        photo_url: photoUrl || undefined,
      });
      onSave();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Worker</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Worker Photo */}
        <div>
          <Label className="text-lg font-semibold mb-4 block">Worker Photo</Label>
          <ImageUpload
            onImageUploaded={(url) => setPhotoUrl(url)}
            bucket="worker-photos"
            folder="workers/"
          />
        </div>

        {/* Worker Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-lg font-semibold">Worker Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter worker name"
              className="mt-2 text-lg p-4"
              required
            />
          </div>
          <div>
            <Label htmlFor="dailyWage" className="text-lg font-semibold">Daily Wage (₹)</Label>
            <Input
              id="dailyWage"
              type="number"
              value={dailyWage}
              onChange={(e) => setDailyWage(e.target.value)}
              placeholder="Enter daily wage"
              className="mt-2 text-lg p-4"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone" className="text-lg font-semibold">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="mt-2 text-lg p-4"
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-lg font-semibold">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="mt-2 text-lg p-4"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-3"
            disabled={!name || loading}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Saving...' : 'Save Worker'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkerForm;
