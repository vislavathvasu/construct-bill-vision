
-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(worker_id, date)
);

-- Create advances table for tracking advance payments
CREATE TABLE public.advances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(8,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on attendance table
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for attendance table
CREATE POLICY "Users can view their own attendance records" 
  ON public.attendance 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attendance records" 
  ON public.attendance 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance records" 
  ON public.attendance 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendance records" 
  ON public.attendance 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on advances table
ALTER TABLE public.advances ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for advances table
CREATE POLICY "Users can view their own advances records" 
  ON public.advances 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own advances records" 
  ON public.advances 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own advances records" 
  ON public.advances 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own advances records" 
  ON public.advances 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON public.attendance 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_advances_updated_at 
    BEFORE UPDATE ON public.advances 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.update_updated_at_column();

-- Update workers table to ensure daily_wage is not null for salary calculations
ALTER TABLE public.workers ALTER COLUMN daily_wage SET DEFAULT 500.00;
UPDATE public.workers SET daily_wage = 500.00 WHERE daily_wage IS NULL;
ALTER TABLE public.workers ALTER COLUMN daily_wage SET NOT NULL;
