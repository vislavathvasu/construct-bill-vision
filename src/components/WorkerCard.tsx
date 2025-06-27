
import React from 'react';
import { Phone, User, Trash2, MessageCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Worker } from '@/hooks/useWorkers';
import { useNavigate } from 'react-router-dom';

interface WorkerCardProps {
  worker: Worker;
  onDelete: () => void;
  onClick: () => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onDelete, onClick }) => {
  const navigate = useNavigate();

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

  return (
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
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={14} />
                <span className="text-sm truncate">{worker.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {worker.phone && (
          <Button 
            onClick={openWhatsApp}
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white flex-1 h-10"
          >
            <MessageCircle size={16} className="mr-2" />
            WhatsApp
          </Button>
        )}
        <Button 
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="text-blue-500 border-blue-200 hover:bg-blue-50 h-10"
        >
          <Edit size={16} className="mr-2" />
          Edit
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
          <Trash2 size={16} className="mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default WorkerCard;
