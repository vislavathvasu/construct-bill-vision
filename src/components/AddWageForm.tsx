
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { useWorkers } from '@/hooks/useWorkers';

interface AddWageFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const AddWageForm: React.FC<AddWageFormProps> = ({ onSave, onCancel }) => {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hoursWorked, setHoursWorked] = useState('8');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { workers, addWageRecord } = useWorkers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker || !amount) return;

    setLoading(true);
    try {
      await addWageRecord({
        worker_id: selectedWorker,
        amount: parseFloat(amount),
        date,
        hours_worked: hoursWorked ? parseFloat(hoursWorked) : undefined,
        notes: notes || undefined,
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
        <h2 className="text-2xl font-bold text-gray-800">Record Daily Wage</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Worker Selection */}
        <div>
          <Label className="text-lg font-semibold mb-4 block">Select Worker</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedWorker === worker.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedWorker(worker.id)}
              >
                <div className="flex items-center space-x-3">
                  {worker.photo_url ? (
                    <img 
                      src={worker.photo_url} 
                      alt={worker.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 font-bold">
                        {worker.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{worker.name}</p>
                    {worker.daily_wage && (
                      <p className="text-sm text-gray-500">₹{worker.daily_wage}/day</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wage Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="amount" className="text-lg font-semibold">Amount (₹) *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter wage amount"
              className="mt-2 text-lg p-4"
              required
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-lg font-semibold">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 text-lg p-4"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="hoursWorked" className="text-lg font-semibold">Hours Worked</Label>
            <Input
              id="hoursWorked"
              type="number"
              step="0.5"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              placeholder="Enter hours worked"
              className="mt-2 text-lg p-4"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-lg font-semibold">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes"
              className="mt-2 text-lg p-4"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-3"
            disabled={!selectedWorker || !amount || loading}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Saving...' : 'Record Wage'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWageForm;
