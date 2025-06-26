
import React from 'react';
import { Calendar, User, StickyNote, IndianRupee } from 'lucide-react';
import { ExpenditureRecord } from '@/hooks/useWorkers';

interface ExpenditureRecordCardProps {
  record: ExpenditureRecord;
}

const ExpenditureRecordCard: React.FC<ExpenditureRecordCardProps> = ({ record }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {record.worker?.photo_url ? (
            <img 
              src={record.worker.photo_url} 
              alt="Worker"
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <Calendar size={14} />
              <span>{new Date(record.date).toLocaleDateString('en-IN')}</span>
            </div>
            {record.worker?.phone && (
              <p className="text-sm text-gray-600 mt-1">{record.worker.phone}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-2xl font-bold text-red-600">
            <IndianRupee size={20} />
            <span>{record.amount}</span>
          </div>
        </div>
      </div>
      
      {record.notes && (
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <StickyNote size={14} />
          <span className="truncate">{record.notes}</span>
        </div>
      )}
    </div>
  );
};

export default ExpenditureRecordCard;
