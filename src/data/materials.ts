
import { 
  Wrench, 
  Building, 
  Zap, 
  Droplets, 
  Hammer, 
  Truck,
  Paintbrush2,
  Shield,
  TreePine,
  Layers
} from 'lucide-react';

export const materialTypes = [
  {
    id: 'pipes',
    name: 'Water Pipes',
    icon: Droplets,
  },
  {
    id: 'cement',
    name: 'Cement',
    icon: Building,
  },
  {
    id: 'steel',
    name: 'Steel/Rebar',
    icon: Shield,
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: Zap,
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: Hammer,
  },
  {
    id: 'hardware',
    name: 'Hardware',
    icon: Wrench,
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: Paintbrush2,
  },
  {
    id: 'wood',
    name: 'Wood',
    icon: TreePine,
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: Truck,
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    icon: Layers,
  },
];
