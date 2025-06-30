
import React from 'react';
import { Calendar, MapPin, Receipt, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseBill } from '@/hooks/useBills';
import { useNavigate } from 'react-router-dom';
import { materialTypes } from '@/data/materials';

interface BillCardProps {
  bill: DatabaseBill;
  onView: () => void;
  onDelete: () => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onView, onDelete }) => {
  const navigate = useNavigate();
  
  // Find the material icon from the materials data
  const materialData = materialTypes.find(m => m.name === bill.material);
  const IconComponent = materialData?.icon || Receipt;
  
  const handleEdit = () => {
    navigate(`/edit-bill/${bill.id}`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="p-2 sm:p-3 bg-blue-50 rounded-lg flex-shrink-0">
            <IconComponent size={20} className="text-blue-600 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg text-gray-800 truncate">{bill.shop_name}</h3>
            <p className="text-sm sm:text-base text-gray-600 truncate">{bill.material}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="text-lg sm:text-2xl font-bold text-green-600">₹{bill.amount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>{bill.date}</span>
        </div>
        {bill.location && (
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span className="truncate">{bill.location}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          onClick={onView}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white h-12 sm:h-auto"
        >
          <Receipt size={16} className="mr-2" />
          View
        </Button>
        <Button 
          onClick={handleEdit}
          variant="outline"
          className="sm:px-4 text-blue-500 border-blue-200 hover:bg-blue-50 h-12 sm:h-auto"
        >
          <Edit size={16} />
          <span className="ml-2 sm:hidden">Edit</span>
        </Button>
        <Button 
          onClick={onDelete}
          variant="outline"
          className="sm:px-4 text-red-500 border-red-200 hover:bg-red-50 h-12 sm:h-auto"
        >
          <Trash2 size={16} />
          <span className="ml-2 sm:hidden">Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default BillCard;
