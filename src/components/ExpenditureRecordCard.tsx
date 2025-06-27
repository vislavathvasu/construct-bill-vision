
import React from 'react';
import { Calendar, DollarSign, User, StickyNote } from 'lucide-react';
import { ExpenditureRecord } from '@/hooks/useWorkers';

interface ExpenditureRecordCardProps {
  record: ExpenditureRecord;
  onWorkerClick?: (workerId: string) => void;
}

const ExpenditureRecordCard: React.FC<ExpenditureRecordCardProps> = ({ record, onWorkerClick }) => {
  const handleWorkerClick = () => {
    if (onWorkerClick && record.worker_id) {
      onWorkerClick(record.worker_id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {record.worker?.photo_url ? (
            <img 
              src={record.worker.photo_url} 
              alt={record.worker.name || 'Worker'}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
          )}
          <div>
            <h4 
              className={`font-semibold text-gray-800 ${onWorkerClick ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
              onClick={handleWorkerClick}
            >
              {record.worker?.name || 'Unknown Worker'}
            </h4>
            {record.worker?.phone && (
              <p className="text-sm text-gray-600">{record.worker.phone}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">₹{record.amount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>{new Date(record.date).toLocaleDateString('en-IN')}</span>
        </div>
        {record.notes && (
          <div className="flex items-center space-x-1">
            <StickyNote size={14} />
            <span className="truncate max-w-32">{record.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenditureRecordCard;
