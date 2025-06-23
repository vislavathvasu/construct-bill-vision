
import React from 'react';
import { Calendar, Clock, User, StickyNote } from 'lucide-react';
import { WageRecord } from '@/hooks/useWorkers';

interface WageRecordCardProps {
  record: WageRecord;
}

const WageRecordCard: React.FC<WageRecordCardProps> = ({ record }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {record.worker?.photo_url ? (
            <img 
              src={record.worker.photo_url} 
              alt={record.worker.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {record.worker?.name || 'Unknown Worker'}
            </h3>
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <Calendar size={14} />
              <span>{new Date(record.date).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">₹{record.amount}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        {record.hours_worked && (
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{record.hours_worked} hours</span>
          </div>
        )}
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

export default WageRecordCard;
