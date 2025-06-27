
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import VoiceInput from './VoiceInput';
import { useWorkers } from '@/hooks/useWorkers';

interface AddWorkerFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const AddWorkerForm: React.FC<AddWorkerFormProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { addWorker } = useWorkers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name && !phone && !photoUrl) return;

    setLoading(true);
    try {
      await addWorker({
        name: name || 'Worker',
        phone: phone || undefined,
        photo_url: photoUrl || undefined,
      });
      onSave();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Worker</h2>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X size={16} className="mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Worker Photo */}
        <div>
          <Label className="text-base sm:text-lg font-semibold mb-4 block">Worker Photo</Label>
          <ImageUpload
            onImageUploaded={(url) => setPhotoUrl(url)}
            bucket="worker-photos"
            folder="workers/"
          />
        </div>

        {/* Worker Name with Voice Input */}
        <div>
          <Label htmlFor="name" className="text-base sm:text-lg font-semibold">Worker Name</Label>
          <div className="mt-2 space-y-3">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter worker name"
              className="text-base sm:text-lg p-3 sm:p-4 h-12 sm:h-auto"
            />
            <VoiceInput
              onResult={(text) => setName(text)}
              placeholder="Click to speak name"
              className="w-full h-12"
            />
          </div>
        </div>

        {/* Phone Number with Voice Input */}
        <div>
          <Label htmlFor="phone" className="text-base sm:text-lg font-semibold">Phone Number</Label>
          <div className="mt-2 space-y-3">
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="text-base sm:text-lg p-3 sm:p-4 h-12 sm:h-auto"
            />
            <VoiceInput
              onResult={(text) => {
                // Extract numbers from speech
                const numbers = text.replace(/\D/g, '');
                setPhone(numbers);
              }}
              placeholder="Click to speak phone number"
              className="w-full h-12"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white text-base sm:text-lg py-3 sm:py-4 h-12 sm:h-auto"
            disabled={(!name && !phone && !photoUrl) || loading}
          >
            <Save size={20} className="mr-2" />
            {loading ? 'Saving...' : 'Save Worker'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkerForm;
