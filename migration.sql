-- =============================================
-- NAZZ — Migración de columnas faltantes
-- Ejecuta esto en el SQL Editor de Supabase
-- =============================================

-- Agregar columnas faltantes a 'tasks' si no existen
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS subject text;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('BAJA','MEDIA','ALTA')) DEFAULT 'MEDIA';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_date timestamp with time zone;

-- Agregar columnas faltantes a 'schedule' si no existen
ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS teacher text;
ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS room text;
ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS end_time time;

-- Agregar columnas faltantes a 'notes' si no existen
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS subject text;

-- Agregar columnas faltantes a 'evaluations' si no existen
ALTER TABLE public.evaluations ADD COLUMN IF NOT EXISTS eval_date date;
ALTER TABLE public.evaluations ADD COLUMN IF NOT EXISTS weight numeric(5,2) DEFAULT 20;
ALTER TABLE public.evaluations ADD COLUMN IF NOT EXISTS max_grade numeric(5,2) DEFAULT 10;
