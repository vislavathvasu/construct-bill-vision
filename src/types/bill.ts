
import { LucideIcon } from 'lucide-react';

export interface Bill {
  id: string;
  shopName: string;
  material: string;
  amount: number;
  date: string;
  location?: string;
  materialIcon: LucideIcon;
}
