
import React from 'react';
import { Calendar, MapPin, Receipt, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bill } from '@/types/bill';

interface BillCardProps {
  bill: Bill;
  onView: () => void;
  onDelete: () => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onView, onDelete }) => {
  const IconComponent = bill.materialIcon;
  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <IconComponent size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{bill.shopName}</h3>
            <p className="text-gray-600">{bill.material}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">₹{bill.amount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <span>{bill.date}</span>
        </div>
        {bill.location && (
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            <span>{bill.location}</span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button 
          onClick={onView}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Receipt size={16} className="mr-2" />
          View Bill
        </Button>
        <Button 
          onClick={onDelete}
          variant="outline"
          className="px-4 text-red-500 border-red-200 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default BillCard;
