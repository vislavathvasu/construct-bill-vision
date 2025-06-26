
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
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { workers, addExpenditureRecord } = useWorkers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker || !amount) return;

    setLoading(true);
    try {
      await addExpenditureRecord({
        worker_id: selectedWorker,
        amount: parseFloat(amount),
        date,
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
        <h2 className="text-2xl font-bold text-gray-800">Record Daily Expenditure</h2>
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
                      alt="Worker"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-2xl">👤</span>
                    </div>
                  )}
                  <div>
                    {worker.phone && (
                      <p className="text-sm font-medium">{worker.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount and Date */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="amount" className="text-lg font-semibold">Amount (₹) *</Label>
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

        <div>
          <Label htmlFor="notes" className="text-lg font-semibold">Notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for payment"
            className="mt-2 text-lg p-4"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-3"
            disabled={!selectedWorker || !amount || loading}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Saving...' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWageForm;
