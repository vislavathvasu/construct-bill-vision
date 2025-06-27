
import React, { useState } from 'react';
import { X, Phone, MapPin, Calendar, DollarSign, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Worker, ExpenditureRecord } from '@/hooks/useWorkers';
import TextToSpeech from './TextToSpeech';
import ExpenditureRecordCard from './ExpenditureRecordCard';

interface WorkerDetailModalProps {
  worker: Worker;
  expenditureRecords: ExpenditureRecord[];
  onClose: () => void;
}

const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({ 
  worker, 
  expenditureRecords, 
  onClose 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const workerRecords = expenditureRecords.filter(record => record.worker_id === worker.id);
  
  const monthlyRecords = workerRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() + 1 === selectedMonth && recordDate.getFullYear() === selectedYear;
  });

  const monthlyTotal = monthlyRecords.reduce((sum, record) => sum + record.amount, 0);
  const totalPaid = workerRecords.reduce((sum, record) => sum + record.amount, 0);

  const openWhatsApp = () => {
    const message = `Hello! This is regarding your work payment. Please let me know if you have any questions.`;
    const whatsappUrl = `https://wa.me/${worker.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Worker Details</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              <X size={16} />
            </Button>
          </div>

          {/* Worker Info */}
          <div className="flex items-start space-x-6 mb-8">
            {worker.photo_url ? (
              <img 
                src={worker.photo_url} 
                alt="Worker"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-3xl">👤</span>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold">{worker.name}</h3>
                <TextToSpeech text={worker.name} />
              </div>
              
              {worker.phone && (
                <div className="flex items-center space-x-2 mb-2">
                  <Phone size={16} className="text-gray-500" />
                  <span>{worker.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign size={16} className="text-gray-500" />
                <span className="font-medium">Total Paid: ₹{totalPaid.toLocaleString()}</span>
              </div>

              <div className="flex space-x-3">
                {worker.phone && (
                  <Button 
                    onClick={openWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageCircle size={16} className="mr-2" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Filter */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-semibold mb-4">Monthly Expenditure</h4>
            <div className="flex items-center space-x-4 mb-4">
              <div>
                <Label htmlFor="month">Month</Label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="ml-2 p-2 border rounded"
                >
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="ml-2 w-24"
                />
              </div>
            </div>
            <div className="text-xl font-bold text-green-600">
              {monthNames[selectedMonth - 1]} {selectedYear}: ₹{monthlyTotal.toLocaleString()}
            </div>
          </div>

          {/* Monthly Records */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Payment Records - {monthNames[selectedMonth - 1]} {selectedYear}
            </h4>
            {monthlyRecords.length > 0 ? (
              <div className="grid gap-4">
                {monthlyRecords.map((record) => (
                  <ExpenditureRecordCard key={record.id} record={record} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No payments found for {monthNames[selectedMonth - 1]} {selectedYear}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailModal;
