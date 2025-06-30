
import React, { useState } from 'react';
import { X, DollarSign, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Worker } from '@/hooks/useWorkers';

interface EditWageModalProps {
  worker: Worker;
  onSave: (dailyWage: number) => void;
  onClose: () => void;
}

const EditWageModal: React.FC<EditWageModalProps> = ({ worker, onSave, onClose }) => {
  const [dailyWage, setDailyWage] = useState(worker.daily_wage?.toString() || '500');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyWage || isNaN(Number(dailyWage))) return;

    setLoading(true);
    try {
      await onSave(Number(dailyWage));
      onClose();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <DollarSign size={24} className="text-green-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Daily Wage</h2>
              <p className="text-gray-600">{worker.name}</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="dailyWage" className="text-lg font-semibold">
                Daily Wage (₹)
              </Label>
              <Input
                id="dailyWage"
                type="number"
                value={dailyWage}
                onChange={(e) => setDailyWage(e.target.value)}
                placeholder="Enter daily wage"
                className="mt-2 text-lg p-4"
                min="0"
                step="50"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button 
              type="button" 
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-500 hover:bg-green-600"
              disabled={loading || !dailyWage || isNaN(Number(dailyWage))}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWageModal;
