
-- Create a table for storing construction bills
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  shop_name TEXT NOT NULL,
  material TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  bill_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for material types (for consistency)
CREATE TABLE public.material_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the material types
INSERT INTO public.material_types (name, icon_name) VALUES
('Water Pipes', 'pipe'),
('Cement', 'package'),
('Steel/Rebar', 'zap'),
('Bricks', 'square'),
('Sand', 'mountain'),
('Electrical Wires', 'zap'),
('Paint', 'palette'),
('Tiles', 'grid-3x3'),
('Wood/Timber', 'tree-pine'),
('Glass', 'rectangle'),
('Screws & Nails', 'wrench'),
('Doors & Windows', 'door-open'),
('Plumbing Fixtures', 'droplets'),
('Insulation', 'shield'),
('Roofing Materials', 'home');

-- Create storage bucket for bill photos
INSERT INTO storage.buckets (id, name, public) VALUES ('bill-photos', 'bill-photos', true);

-- Enable Row Level Security (RLS) on bills table
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bills table
CREATE POLICY "Users can view their own bills" 
  ON public.bills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bills" 
  ON public.bills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bills" 
  ON public.bills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bills" 
  ON public.bills 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage policies for bill photos
CREATE POLICY "Anyone can view bill photos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'bill-photos');

CREATE POLICY "Users can upload bill photos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'bill-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own bill photos" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'bill-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own bill photos" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'bill-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_bills_updated_at 
    BEFORE UPDATE ON public.bills 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.update_updated_at_column();
