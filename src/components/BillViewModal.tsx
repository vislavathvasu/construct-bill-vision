
import React from 'react';
import { X, Calendar, MapPin, Receipt, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseBill } from '@/hooks/useBills';
import { materialTypes } from '@/data/materials';

interface BillViewModalProps {
  bill: DatabaseBill;
  onClose: () => void;
}

const BillViewModal: React.FC<BillViewModalProps> = ({ bill, onClose }) => {
  // Find the material icon from the materials data
  const materialData = materialTypes.find(m => m.name === bill.material);
  const IconComponent = materialData?.icon || Receipt;

  const handleDownload = () => {
    if (bill.bill_photo_url) {
      const link = document.createElement('a');
      link.href = bill.bill_photo_url;
      link.download = `bill-${bill.shop_name}-${bill.date}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Bill Details</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              <X size={16} />
            </Button>
          </div>

          {/* Bill Info */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <IconComponent size={48} className="text-blue-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{bill.shop_name}</h3>
              <p className="text-gray-600 mb-2">{bill.material}</p>
              
              <div className="flex items-center space-x-2 mb-2">
                <Calendar size={16} className="text-gray-500" />
                <span>{bill.date}</span>
              </div>
              
              {bill.location && (
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{bill.location}</span>
                </div>
              )}
              
              <div className="text-3xl font-bold text-green-600">
                ₹{bill.amount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Bill Photo */}
          {bill.bill_photo_url && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">Bill Photo</h4>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={bill.bill_photo_url} 
                  alt="Bill"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <Button 
                onClick={handleDownload}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Download size={16} className="mr-2" />
                Download Bill
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillViewModal;
