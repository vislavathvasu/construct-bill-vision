
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, User, IndianRupee } from 'lucide-react';
import { useWorkers } from '@/hooks/useWorkers';

interface AddExpenditureFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const AddExpenditureForm: React.FC<AddExpenditureFormProps> = ({ onSave, onCancel }) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { workers, addExpenditureRecord } = useWorkers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId || !amount) return;

    setLoading(true);
    try {
      await addExpenditureRecord({
        worker_id: selectedWorkerId,
        date,
        amount: parseFloat(amount),
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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Record Daily Expenditure</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Worker Selection */}
        <div>
          <Label className="text-base sm:text-lg font-semibold mb-4 block">Select Worker</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-64 overflow-y-auto">
            {workers.map((worker) => (
              <div
                key={worker.id}
                onClick={() => setSelectedWorkerId(worker.id)}
                className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all active:scale-95 ${
                  selectedWorkerId === worker.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {worker.photo_url ? (
                    <img 
                      src={worker.photo_url} 
                      alt="Worker"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500 sm:w-6 sm:h-6" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-full">{worker.name}</p>
                    {worker.phone && (
                      <p className="text-xs text-gray-500 truncate">{worker.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label htmlFor="amount" className="text-base sm:text-lg font-semibold">Amount *</Label>
            <div className="relative mt-2">
              <IndianRupee size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="pl-10 text-base sm:text-lg p-3 sm:p-4 h-12 sm:h-auto"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="date" className="text-base sm:text-lg font-semibold">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 text-base sm:text-lg p-3 sm:p-4 h-12 sm:h-auto"
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-base sm:text-lg font-semibold">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter reason for expenditure or any notes..."
            className="mt-2 text-base sm:text-lg p-3 sm:p-4 h-20 sm:h-24"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white text-base sm:text-lg py-3 sm:py-4 h-12 sm:h-auto"
            disabled={!selectedWorkerId || !amount || loading}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Saving...' : 'Record Expenditure'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenditureForm;
