
import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Worker } from '@/hooks/useWorkers';

interface EditDailyWageModalProps {
  worker: Worker;
  onSave: (workerId: string, newWage: number) => void;
  onClose: () => void;
}

const EditDailyWageModal: React.FC<EditDailyWageModalProps> = ({ worker, onSave, onClose }) => {
  const [dailyWage, setDailyWage] = useState(worker.daily_wage || 0);

  const handleSave = () => {
    if (dailyWage > 0) {
      onSave(worker.id, dailyWage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Daily Wage</h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {worker.photo_url ? (
              <img 
                src={worker.photo_url} 
                alt="Worker"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {worker.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{worker.name}</h3>
              <p className="text-sm text-gray-600">Current wage: ₹{worker.daily_wage}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="dailyWage">New Daily Wage</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  id="dailyWage"
                  type="number"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(Number(e.target.value))}
                  className="pl-10"
                  placeholder="Enter daily wage"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDailyWageModal;
