
import React from 'react';
import { Phone, MapPin, User, Trash2, IndianRupee } from 'lucide-react';
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
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-xl text-gray-800">{worker.name}</h3>
            {worker.daily_wage && (
              <div className="flex items-center space-x-1 text-green-600">
                <IndianRupee size={16} />
                <span className="font-medium">{worker.daily_wage}/day</span>
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
      
      <div className="space-y-2 text-sm text-gray-600">
        {worker.phone && (
          <div className="flex items-center space-x-2">
            <Phone size={16} />
            <span>{worker.phone}</span>
          </div>
        )}
        {worker.address && (
          <div className="flex items-center space-x-2">
            <MapPin size={16} />
            <span>{worker.address}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerCard;
