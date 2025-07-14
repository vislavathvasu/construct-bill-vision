import React, { useState, useEffect } from 'react';
import {
  Plus,
  DollarSign,
  MessageCircle,
  Edit,
  Trash2,
  User,
  Download,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom';
import { useWorkers } from '@/hooks/useWorkers';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import WorkerSalaryModal from '@/components/WorkerSalaryModal';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { workers, loading, addWorker, deleteWorker, expenditureRecords, addExpenditureRecord, refetchExpenditureRecords } = useWorkers();
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerPhoto, setNewWorkerPhoto] = useState('');
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [expenditureAmount, setExpenditureAmount] = useState<number | null>(null);
  const [expenditureNotes, setExpenditureNotes] = useState('');

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

  const handleAddWorker = async () => {
    if (newWorkerName.trim() === '') {
      alert('Please enter a worker name.');
      return;
    }

    try {
      await addWorker({
        name: newWorkerName,
        photo_url: newWorkerPhoto,
      });
      setNewWorkerName('');
      setNewWorkerPhoto('');
    } catch (error) {
      console.error('Failed to add worker:', error);
      alert('Failed to add worker. Please try again.');
    }
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await deleteWorker(workerId);
      } catch (error) {
        console.error('Failed to delete worker:', error);
        alert('Failed to delete worker. Please try again.');
      }
    }
  };

  const handleAddExpenditure = async () => {
    if (!selectedWorker || !selectedDate || !expenditureAmount) {
      alert('Please select a worker, date, and enter an amount.');
      return;
    }

    try {
      await addExpenditureRecord({
        worker_id: selectedWorker.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        amount: expenditureAmount,
        notes: expenditureNotes,
      });
      setSelectedWorker(null);
      setSelectedDate(undefined);
      setExpenditureAmount(null);
      setExpenditureNotes('');
      await refetchExpenditureRecords();
    } catch (error) {
      console.error('Failed to add expenditure record:', error);
      alert('Failed to add expenditure record. Please try again.');
    }
  };

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const todayExpenditures = expenditureRecords.filter(record => record.date === todayStr);
  const totalTodayExpenditure = todayExpenditures.reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Workers & Expenditures</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate('/attendance-recording')}>
                Go to Attendance
              </Button>
              <Button onClick={() => navigate('/today-total')}>
                Today Total
              </Button>
              <Button onClick={() => navigate('/total-expenditure')}>
                Total Expenditure
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add Worker Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Worker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workerName" className="block text-sm font-medium text-gray-700">
                Worker Name
              </Label>
              <Input
                type="text"
                id="workerName"
                placeholder="Enter worker name"
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="workerPhoto" className="block text-sm font-medium text-gray-700">
                Photo URL (optional)
              </Label>
              <Input
                type="text"
                id="workerPhoto"
                placeholder="Enter photo URL"
                value={newWorkerPhoto}
                onChange={(e) => setNewWorkerPhoto(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleAddWorker} className="mt-4 bg-blue-500 hover:bg-blue-600">
            <Plus size={16} className="mr-2" />
            Add Worker
          </Button>
        </div>

        {/* Workers List */}
        {loading ? (
          <div className="text-center py-12">Loading workers...</div>
        ) : (
          <div className="space-y-4">
            {workers.map((worker) => (
              <div key={worker.id}>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {worker.photo_url ? (
                        <img 
                          src={worker.photo_url} 
                          alt="Worker"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={24} className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{worker.name}</h3>
                        <p className="text-gray-600">Daily Wage: ₹{worker.daily_wage}</p>
                        {worker.phone && (
                          <p className="text-sm text-gray-500">{worker.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setSelectedWorker(worker)}
                        variant="outline"
                        size="sm"
                        className="text-green-500 border-green-200 hover:bg-green-50"
                      >
                        <DollarSign size={14} className="mr-1" />
                        Salary
                      </Button>
                      
                      {worker.phone && (
                        <Button
                          onClick={() => window.open(`https://wa.me/${worker.phone}`, '_blank')}
                          variant="outline"
                          size="sm"
                          className="text-green-500 border-green-200 hover:bg-green-50"
                        >
                          <MessageCircle size={14} className="mr-1" />
                          WhatsApp
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => navigate(`/edit-worker/${worker.id}`)}
                        variant="outline"
                        size="sm"
                        className="text-blue-500 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteWorker(worker.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expenditure Records Table */}
                <div className="bg-gray-50 rounded-xl shadow-md p-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Expenditure Records</h3>
                  <Table>
                    <TableCaption>A list of your recent expenditures.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenditureRecords
                        .filter(record => record.worker?.id === worker.id)
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>₹{record.amount.toLocaleString()}</TableCell>
                            <TableCell>{record.notes}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Expenditure Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Expenditure Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="workerSelect" className="block text-sm font-medium text-gray-700">
                Select Worker
              </Label>
              <select
                id="workerSelect"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const worker = workers.find(w => w.id === selectedId);
                  setSelectedWorker(worker);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a worker</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="expenditureDate" className="block text-sm font-medium text-gray-700">
                Select Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="expenditureAmount" className="block text-sm font-medium text-gray-700">
                Amount
              </Label>
              <Input
                type="number"
                id="expenditureAmount"
                placeholder="Enter amount"
                value={expenditureAmount === null ? '' : expenditureAmount.toString()}
                onChange={(e) => setExpenditureAmount(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="expenditureNotes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </Label>
            <Input
              type="text"
              id="expenditureNotes"
              placeholder="Enter notes"
              value={expenditureNotes}
              onChange={(e) => setExpenditureNotes(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleAddExpenditure} className="mt-4 bg-green-500 hover:bg-green-600">
            Add Expenditure
          </Button>
        </div>
      </div>

      {selectedWorker && (
        <WorkerSalaryModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </div>
  );
};

export default Index;
