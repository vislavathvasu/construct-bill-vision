
import React from 'react';
import { Phone, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Worker } from '@/hooks/useWorkers';

interface WorkerCardProps {
  worker: Worker;
  onDelete: () => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
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
            {worker.phone && (
              <div className="flex items-center space-x-2 text-lg font-medium">
                <Phone size={18} />
                <span>{worker.phone}</span>
              </div>
            )}
          </div>
        </div>
        <Button 
          onClick={onDelete}
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default WorkerCard;
