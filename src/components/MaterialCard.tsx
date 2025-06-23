
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MaterialCardProps {
  icon: LucideIcon;
  name: string;
  onClick: () => void;
  isSelected?: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ icon: Icon, name, onClick, isSelected = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg
        ${isSelected 
          ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' 
          : 'bg-white text-gray-700 shadow-md hover:shadow-xl border border-gray-200'
        }
      `}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className={`p-4 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-gray-100'}`}>
          <Icon size={32} className={isSelected ? 'text-white' : 'text-gray-600'} />
        </div>
        <span className="text-lg font-semibold text-center">{name}</span>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;
