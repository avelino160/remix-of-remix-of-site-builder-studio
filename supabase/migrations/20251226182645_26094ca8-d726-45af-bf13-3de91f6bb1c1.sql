-- Alterar coluna balance para aceitar valores decimais
ALTER TABLE public.user_credits
ALTER COLUMN balance TYPE numeric(10,2);

-- Atualizar valor padrão para 5.0
ALTER TABLE public.user_credits
ALTER COLUMN balance SET DEFAULT 5.0;