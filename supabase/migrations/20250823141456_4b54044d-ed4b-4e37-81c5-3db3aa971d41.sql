-- CRITICAL SECURITY FIX: Remove public access and implement proper authentication-based RLS

-- First, drop all existing overly permissive policies
DROP POLICY IF EXISTS "Read all products" ON public.products;
DROP POLICY IF EXISTS "Read all sales" ON public.sales;
DROP POLICY IF EXISTS "Read all forecasts" ON public.forecasts;
DROP POLICY IF EXISTS "Read all purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Read all audit logs" ON public.audit_logs;

-- Products table - Only authenticated users can access
CREATE POLICY "Authenticated users can view products" 
ON public.products 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (true);

-- Sales table - Only authenticated users can access
CREATE POLICY "Authenticated users can view sales" 
ON public.sales 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert sales" 
ON public.sales 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update sales" 
ON public.sales 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete sales" 
ON public.sales 
FOR DELETE 
TO authenticated
USING (true);

-- Forecasts table - Only authenticated users can access
CREATE POLICY "Authenticated users can view forecasts" 
ON public.forecasts 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert forecasts" 
ON public.forecasts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update forecasts" 
ON public.forecasts 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete forecasts" 
ON public.forecasts 
FOR DELETE 
TO authenticated
USING (true);

-- Purchase Orders table - Only authenticated users can access
CREATE POLICY "Authenticated users can view purchase orders" 
ON public.purchase_orders 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert purchase orders" 
ON public.purchase_orders 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update purchase orders" 
ON public.purchase_orders 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete purchase orders" 
ON public.purchase_orders 
FOR DELETE 
TO authenticated
USING (true);

-- Audit Logs table - Read-only for authenticated users, system can insert
CREATE POLICY "Authenticated users can view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (true);

-- Only service role can insert/update/delete audit logs (for system logging)
CREATE POLICY "Service role can manage audit logs" 
ON public.audit_logs 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);