
import React from 'react';
import { X, Receipt, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseBill } from '@/hooks/useBills';

interface BillViewModalProps {
  bill: DatabaseBill;
  onClose: () => void;
}

const BillViewModal: React.FC<BillViewModalProps> = ({ bill, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Bill Details</h2>
            <Button onClick={onClose} variant="outline" size="sm">
              <X size={16} />
            </Button>
          </div>

          {/* Bill Image */}
          {bill.bill_photo_url && (
            <div className="mb-6">
              <img 
                src={bill.bill_photo_url} 
                alt="Bill"
                className="w-full h-64 object-contain bg-gray-50 rounded-lg border"
              />
            </div>
          )}

          {/* Bill Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Receipt size={24} className="text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">{bill.shop_name}</h3>
                <p className="text-gray-600">{bill.material}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{bill.amount.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{new Date(bill.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            {bill.location && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{bill.location}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillViewModal;
