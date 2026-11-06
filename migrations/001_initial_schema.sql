-- Migration: 001_initial_schema.sql
-- Description: Core tables, departments, employees, audit logs, RLS policies, and administrative functions

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Employees Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    job_title TEXT,
    date_of_joining DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
    avatar_url TEXT,
    avatar_key TEXT,
    bio TEXT,
    address TEXT,
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Helper Function: Is caller an active admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  );
$$;

-- 5. Field Integrity Trigger: Prevent non-admins from self-promoting or altering status
CREATE OR REPLACE FUNCTION public.prevent_self_role_or_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Unauthorized: only administrators can change employee roles';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Unauthorized: only administrators can change employee status';
    END IF;
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Unauthorized: email cannot be modified directly';
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_self_role_or_status_change ON public.employees;
CREATE TRIGGER trg_prevent_self_role_or_status_change
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.prevent_self_role_or_status_change();

-- 6. Row Level Security Policies
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read departments" ON public.departments;
CREATE POLICY "Allow authenticated read departments"
ON public.departments FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow admin manage departments" ON public.departments;
CREATE POLICY "Allow admin manage departments"
ON public.departments FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read employees" ON public.employees;
CREATE POLICY "Allow read employees"
ON public.employees FOR SELECT
TO authenticated
USING (
  public.is_admin() OR status = 'active' OR id = auth.uid()
);

DROP POLICY IF EXISTS "Allow update employees" ON public.employees;
CREATE POLICY "Allow update employees"
ON public.employees FOR UPDATE
TO authenticated
USING (
  public.is_admin() OR id = auth.uid()
)
WITH CHECK (
  public.is_admin() OR id = auth.uid()
);

DROP POLICY IF EXISTS "Allow admin insert employees" ON public.employees;
CREATE POLICY "Allow admin insert employees"
ON public.employees FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin() OR id = auth.uid()
);

DROP POLICY IF EXISTS "Allow admin delete employees" ON public.employees;
CREATE POLICY "Allow admin delete employees"
ON public.employees FOR DELETE
TO authenticated
USING (
  public.is_admin()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admin read audit logs" ON public.audit_logs;
CREATE POLICY "Allow admin read audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Allow authenticated insert audit logs" ON public.audit_logs;
CREATE POLICY "Allow authenticated insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = actor_id OR public.is_admin());

-- 7. Admin Stored Procedures for Employee Lifecycle
CREATE OR REPLACE FUNCTION public.admin_create_employee(
    p_email TEXT,
    p_password TEXT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_role TEXT,
    p_department_id UUID,
    p_job_title TEXT,
    p_phone TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_user_id UUID;
    v_actor_id UUID;
    v_is_db_admin BOOLEAN;
BEGIN
    v_actor_id := auth.uid();
    v_is_db_admin := (current_user IN ('project_admin', 'postgres'));
    
    IF NOT v_is_db_admin THEN
        IF EXISTS (SELECT 1 FROM public.employees WHERE role = 'admin') AND NOT public.is_admin() THEN
            RAISE EXCEPTION 'Unauthorized: Only active administrators can create employees';
        END IF;
    END IF;

    IF p_role NOT IN ('admin', 'employee') THEN
        RAISE EXCEPTION 'Invalid role. Must be admin or employee';
    END IF;

    IF EXISTS (SELECT 1 FROM auth.users WHERE email = lower(p_email)) THEN
        RAISE EXCEPTION 'A user with this email already exists';
    END IF;

    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        id, email, password, email_verified, profile, metadata, is_project_admin, is_anonymous, created_at, updated_at
    ) VALUES (
        v_user_id, lower(p_email), crypt(p_password, gen_salt('bf', 10)), true,
        jsonb_build_object('name', p_first_name || ' ' || p_last_name), '{}'::jsonb,
        (p_role = 'admin'), false, now(), now()
    );

    INSERT INTO public.employees (
        id, email, first_name, last_name, role, department_id, job_title, phone, status, created_at, updated_at
    ) VALUES (
        v_user_id, lower(p_email), p_first_name, p_last_name, p_role, p_department_id, p_job_title, p_phone, 'active', now(), now()
    );

    INSERT INTO public.audit_logs (
        actor_id, action, target_id, details
    ) VALUES (
        v_actor_id, 'EMPLOYEE_CREATED', v_user_id,
        jsonb_build_object('email', lower(p_email), 'role', p_role, 'job_title', p_job_title)
    );

    RETURN v_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_employee_status(
    p_employee_id UUID,
    p_status TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only administrators can change employee status';
    END IF;

    IF p_status NOT IN ('active', 'inactive', 'on_leave', 'terminated') THEN
        RAISE EXCEPTION 'Invalid status';
    END IF;

    UPDATE public.employees
    SET status = p_status, updated_at = now()
    WHERE id = p_employee_id;

    INSERT INTO public.audit_logs (
        actor_id, action, target_id, details
    ) VALUES (
        auth.uid(), 'EMPLOYEE_STATUS_CHANGED', p_employee_id,
        jsonb_build_object('new_status', p_status)
    );
END;
$$;

