
-- Add image upload functionality to bills (modify existing bills table)
ALTER TABLE public.bills 
ADD COLUMN IF NOT EXISTS bill_image_path TEXT;

-- Create a table for workers
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  daily_wage DECIMAL(8,2),
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for daily wage records
CREATE TABLE public.wage_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  worker_id UUID REFERENCES public.workers(id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount DECIMAL(8,2) NOT NULL,
  hours_worked DECIMAL(4,2) DEFAULT 8.0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for worker photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('worker-photos', 'worker-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on workers table
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workers table
CREATE POLICY "Users can view their own workers" 
  ON public.workers 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workers" 
  ON public.workers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workers" 
  ON public.workers 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workers" 
  ON public.workers 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on wage_records table
ALTER TABLE public.wage_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wage_records table
CREATE POLICY "Users can view their own wage records" 
  ON public.wage_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wage records" 
  ON public.wage_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wage records" 
  ON public.wage_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wage records" 
  ON public.wage_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage policies for worker photos
CREATE POLICY "Anyone can view worker photos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'worker-photos');

CREATE POLICY "Users can upload worker photos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'worker-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own worker photos" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'worker-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own worker photos" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'worker-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_workers_updated_at 
    BEFORE UPDATE ON public.workers 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_wage_records_updated_at 
    BEFORE UPDATE ON public.wage_records 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.update_updated_at_column();
