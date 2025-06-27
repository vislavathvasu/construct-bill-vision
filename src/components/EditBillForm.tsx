
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Save, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import MaterialCard from './MaterialCard';
import ImageUpload from './ImageUpload';
import { materialTypes } from '../data/materials';
import { useBills, DatabaseBill } from '@/hooks/useBills';

interface EditBillFormProps {
  bill: DatabaseBill;
  onSave: () => void;
  onCancel: () => void;
}

const EditBillForm: React.FC<EditBillFormProps> = ({ bill, onSave, onCancel }) => {
  const materialData = materialTypes.find(m => m.name === bill.material);
  const [selectedMaterial, setSelectedMaterial] = useState(materialData?.id || '');
  const [shopName, setShopName] = useState(bill.shop_name);
  const [amount, setAmount] = useState(bill.amount.toString());
  const [location, setLocation] = useState(bill.location || '');
  const [billImageUrl, setBillImageUrl] = useState(bill.bill_photo_url || '');
  const [billImagePath, setBillImagePath] = useState(bill.bill_image_path || '');
  const [date, setDate] = useState<Date>(new Date(bill.date));
  const [loading, setLoading] = useState(false);
  const { updateBill } = useBills();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !shopName || !amount) return;

    setLoading(true);
    try {
      const materialData = materialTypes.find(m => m.id === selectedMaterial);
      await updateBill(bill.id, {
        shop_name: shopName,
        material: materialData?.name || '',
        amount: parseFloat(amount),
        date: date.toISOString().split('T')[0],
        location: location || undefined,
        bill_photo_url: billImageUrl || undefined,
        bill_image_path: billImagePath || undefined,
      });
      onSave();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Bill</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Material Selection */}
        <div>
          <Label className="text-lg font-semibold mb-4 block">Select Material</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {materialTypes.map((material) => (
              <MaterialCard
                key={material.id}
                icon={material.icon}
                name={material.name}
                onClick={() => setSelectedMaterial(material.id)}
                isSelected={selectedMaterial === material.id}
              />
            ))}
          </div>
        </div>

        {/* Bill Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="shopName" className="text-lg font-semibold">Shop Name</Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter shop name"
              className="mt-2 text-lg p-4"
              required
            />
          </div>
          <div>
            <Label htmlFor="amount" className="text-lg font-semibold">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-2 text-lg p-4"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="location" className="text-lg font-semibold">Location (Optional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="mt-2 text-lg p-4"
            />
          </div>
          <div>
            <Label className="text-lg font-semibold">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-2 text-lg p-4 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Bill Photo Upload */}
        <div>
          <Label className="text-lg font-semibold mb-4 block">Bill Photo</Label>
          <ImageUpload
            onImageUploaded={(url, path) => {
              setBillImageUrl(url);
              setBillImagePath(path);
            }}
            bucket="bill-photos"
            folder="bills/"
            initialImageUrl={billImageUrl}
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg py-3"
            disabled={!selectedMaterial || !shopName || !amount || loading}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Updating...' : 'Update Bill'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBillForm;
