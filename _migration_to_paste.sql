-- ============================================================================
-- 3D Printing System Migration
-- Creates tables for token wallet, print orders, and Meshy AI jobs
-- ============================================================================

-- User token wallet
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Token transaction ledger
CREATE TABLE IF NOT EXISTS token_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,             -- positive = credit, negative = debit
  type TEXT NOT NULL CHECK (type IN ('topup', 'deduct', 'refund')),
  description TEXT,
  stripe_session_id TEXT,              -- for topup entries
  print_order_id UUID,                 -- for deduct entries (FK added below)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Print orders
CREATE TABLE IF NOT EXISTS print_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'printing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded')
  ),
  -- Model source
  model_source TEXT NOT NULL CHECK (model_source IN ('upload', 'ai_text', 'ai_image', 'catalog')),
  model_file_url TEXT,                 -- for uploads
  meshy_job_id TEXT,                   -- for AI-generated models
  model_preview_url TEXT,              -- thumbnail/preview image
  model_name TEXT NOT NULL DEFAULT 'Custom Print',
  -- Configuration
  material TEXT NOT NULL DEFAULT 'pla' CHECK (material IN ('pla', 'resin', 'metal')),
  color TEXT NOT NULL DEFAULT 'white',
  scale_cm INTEGER NOT NULL DEFAULT 15 CHECK (scale_cm BETWEEN 5 AND 50),
  infill_percent INTEGER NOT NULL DEFAULT 20 CHECK (infill_percent IN (10, 20, 40, 60, 80, 100)),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 10),
  -- Pricing
  token_cost INTEGER NOT NULL,
  -- Customer info (copied at order time)
  customer_email TEXT,
  customer_name TEXT,
  delivery_address JSONB,
  -- Fulfilment
  tracking_number TEXT,
  admin_note TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from token_ledger to print_orders
ALTER TABLE token_ledger
  ADD CONSTRAINT fk_token_ledger_print_order
  FOREIGN KEY (print_order_id) REFERENCES print_orders(id) ON DELETE SET NULL;

-- Meshy AI job tracking
CREATE TABLE IF NOT EXISTS meshy_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meshy_task_id TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('text_to_3d', 'image_to_3d')),
  prompt TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'succeeded', 'failed', 'expired')
  ),
  model_url TEXT,
  thumbnail_url TEXT,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_token_ledger_user_id ON token_ledger(user_id);
CREATE INDEX idx_print_orders_user_id ON print_orders(user_id);
CREATE INDEX idx_print_orders_status ON print_orders(status);
CREATE INDEX idx_meshy_jobs_user_id ON meshy_jobs(user_id);
CREATE INDEX idx_meshy_jobs_task_id ON meshy_jobs(meshy_task_id);

-- RLS policies
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE print_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meshy_jobs ENABLE ROW LEVEL SECURITY;

-- user_tokens: users see/update own row; service role bypasses
CREATE POLICY "Users read own tokens" ON user_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages tokens" ON user_tokens FOR ALL USING (auth.role() = 'service_role');

-- token_ledger: users read own; service inserts
CREATE POLICY "Users read own ledger" ON token_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages ledger" ON token_ledger FOR ALL USING (auth.role() = 'service_role');

-- print_orders: users read own; service manages all
CREATE POLICY "Users read own print orders" ON print_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own print orders" ON print_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service manages print orders" ON print_orders FOR ALL USING (auth.role() = 'service_role');

-- meshy_jobs: users read own; service manages all
CREATE POLICY "Users read own meshy jobs" ON meshy_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert meshy jobs" ON meshy_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service manages meshy jobs" ON meshy_jobs FOR ALL USING (auth.role() = 'service_role');

-- Auto-create wallet row when user signs up
CREATE OR REPLACE FUNCTION public.create_user_token_wallet()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_tokens (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_token_wallet();

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON user_tokens FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_print_orders_updated_at BEFORE UPDATE ON print_orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meshy_jobs_updated_at BEFORE UPDATE ON meshy_jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RPC: atomically increment token balance
CREATE OR REPLACE FUNCTION increment_user_tokens(p_user_id UUID, p_amount INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO user_tokens (user_id, balance) VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id) DO UPDATE SET balance = user_tokens.balance + p_amount, updated_at = NOW();
END;
$$;

-- RPC: atomically deduct tokens (returns false if insufficient)
CREATE OR REPLACE FUNCTION deduct_user_tokens(p_user_id UUID, p_amount INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_balance INTEGER;
BEGIN
  SELECT balance INTO v_balance FROM user_tokens WHERE user_id = p_user_id FOR UPDATE;
  IF v_balance IS NULL OR v_balance < p_amount THEN RETURN FALSE; END IF;
  UPDATE user_tokens SET balance = balance - p_amount, updated_at = NOW() WHERE user_id = p_user_id;
  RETURN TRUE;
END;
$$;

-- Storage bucket for 3D model uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('3d-models', '3d-models', false) ON CONFLICT DO NOTHING;

CREATE POLICY "Users upload own models" ON storage.objects FOR INSERT WITH CHECK (bucket_id = '3d-models' AND auth.role() = 'authenticated');
CREATE POLICY "Users read own models" ON storage.objects FOR SELECT USING (bucket_id = '3d-models' AND auth.uid()::text = (storage.foldername(name))[1]);
