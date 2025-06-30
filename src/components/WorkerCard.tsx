
import React, { useState } from 'react';
import { Phone, User, Trash2, MessageCircle, Edit, Calculator, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Worker, useWorkers } from '@/hooks/useWorkers';
import { useNavigate } from 'react-router-dom';
import EditWageModal from './EditWageModal';

interface WorkerCardProps {
  worker: Worker;
  onDelete: () => void;
  onClick: () => void;
  onViewSalary: () => void;
  onViewAttendance?: () => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ 
  worker, 
  onDelete, 
  onClick, 
  onViewSalary, 
  onViewAttendance 
}) => {
  const navigate = useNavigate();
  const { updateWorkerWage } = useWorkers();
  const [showEditWage, setShowEditWage] = useState(false);

  const openWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (worker.phone) {
      const message = `Hello! This is regarding your work. Please let me know if you have any questions.`;
      const whatsappUrl = `https://wa.me/${worker.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-worker/${worker.id}`);
  };

  const handleViewSalary = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewSalary();
  };

  const handleViewAttendance = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewAttendance) {
      onViewAttendance();
    } else {
      navigate('/attendance');
    }
  };

  const handleEditWage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditWage(true);
  };

  const handleWageSave = async (dailyWage: number) => {
    await updateWorkerWage(worker.id, dailyWage);
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-gray-100 cursor-pointer active:scale-95"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            {worker.photo_url ? (
              <img 
                src={worker.photo_url} 
                alt="Worker"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-gray-500 sm:w-8 sm:h-8" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">{worker.name}</h3>
              {worker.phone && (
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Phone size={14} />
                  <span className="text-sm truncate">{worker.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-sm">Daily Wage: ₹{worker.daily_wage?.toLocaleString() || 'Not set'}</span>
                <Button
                  onClick={handleEditWage}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 text-blue-500 hover:bg-blue-50"
                >
                  <DollarSign size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Button 
            onClick={handleViewSalary}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white h-10"
          >
            <Calculator size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Salary</span>
          </Button>
          
          <Button 
            onClick={handleViewAttendance}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white h-10"
          >
            <Calendar size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
          
          {worker.phone && (
            <Button 
              onClick={openWhatsApp}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white h-10 col-span-2 sm:col-span-1"
            >
              <MessageCircle size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          )}
          
          <Button 
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="text-blue-500 border-blue-200 hover:bg-blue-50 h-10"
          >
            <Edit size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            variant="outline"
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50 h-10"
          >
            <Trash2 size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {showEditWage && (
        <EditWageModal
          worker={worker}
          onSave={handleWageSave}
          onClose={() => setShowEditWage(false)}
        />
      )}
    </>
  );
};

export default WorkerCard;
