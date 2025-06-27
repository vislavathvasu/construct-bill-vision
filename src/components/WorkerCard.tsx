
import React from 'react';
import { Phone, User, Trash2, MessageCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Worker } from '@/hooks/useWorkers';

interface WorkerCardProps {
  worker: Worker;
  onDelete: () => void;
  onClick: () => void;
  onEdit: () => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onDelete, onClick, onEdit }) => {
  const openWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (worker.phone) {
      const message = `Hello! This is regarding your work. Please let me know if you have any questions.`;
      const whatsappUrl = `https://wa.me/${worker.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {worker.photo_url ? (
            <img 
              src={worker.photo_url} 
              alt="Worker"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold mb-1">{worker.name}</h3>
            {worker.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>{worker.phone}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {worker.phone && (
            <Button 
              onClick={openWhatsApp}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle size={16} />
            </Button>
          )}
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            variant="outline"
            size="sm"
            className="text-blue-500 border-blue-200 hover:bg-blue-50"
          >
            <Edit size={16} />
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            variant="outline"
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
