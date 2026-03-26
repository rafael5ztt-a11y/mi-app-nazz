-- =============================================
-- ANTIGRAVITY ACADÉMICO - Supabase Schema
-- Ejecuta este script COMPLETO en el SQL Editor
-- de tu proyecto de Supabase (primero borra el
-- contenido anterior si lo pegaste antes)
-- =============================================

-- 1. Tabla de Perfiles de Usuario
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfil propio" ON public.users USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Tabla de Tareas
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  subject text,
  description text,
  priority text CHECK (priority IN ('BAJA','MEDIA','ALTA')) DEFAULT 'MEDIA',
  due_date timestamp with time zone,
  is_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tareas propias" ON public.tasks USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Tabla de Horario
CREATE TABLE IF NOT EXISTS public.schedule (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  teacher text,
  day_of_week text CHECK (day_of_week IN ('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado')) NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  color text DEFAULT '#5916eb',
  room text,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Horario propio" ON public.schedule USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Tabla de Notas
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  subject text,
  color text DEFAULT '#f8f9fc',
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notas propias" ON public.notes USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Tabla de Evaluaciones
CREATE TABLE IF NOT EXISTS public.evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  title text NOT NULL,
  grade numeric(5,2),
  max_grade numeric(5,2) DEFAULT 10,
  weight numeric(5,2) DEFAULT 100,
  eval_date date,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Evaluaciones propias" ON public.evaluations USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Tabla de Fotos
CREATE TABLE IF NOT EXISTS public.photos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title text,
  subject text,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fotos propias" ON public.photos USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. Trigger: creación automática de perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Bucket de Storage para Fotos (ejecutar por separado si falla)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('fotos-academicas', 'fotos-academicas', true);
-- CREATE POLICY "Subir fotos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fotos-academicas' AND auth.role() = 'authenticated');
-- CREATE POLICY "Ver fotos" ON storage.objects FOR SELECT USING (bucket_id = 'fotos-academicas');
