-- Script para rodar no SQL Editor do Supabase

-- 1. Tabela de Eventos
CREATE TABLE events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  date_description text NOT NULL,
  speaker text,
  price numeric(10, 2),
  cover_url text,
  active boolean DEFAULT true
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Todos podem ver eventos ativos
CREATE POLICY "Permitir leitura publica de eventos" ON events
  FOR SELECT
  USING (active = true);

-- Apenas admins podem modificar eventos
CREATE POLICY "Permitir modificacao apenas para autenticados" ON events
  FOR ALL
  USING (auth.role() = 'authenticated');


-- 2. Tabela de Inscrições (Atualizada)
CREATE TABLE registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE, -- Relacionamento com o evento
  nome_completo text NOT NULL,
  email text,
  telefone text NOT NULL,
  sexo text NOT NULL,
  idade integer NOT NULL,
  rua text,
  bairro text,
  cidade text,
  estado text,
  tipo_sanguineo text,
  problema_saude text,
  problema_saude_qual text,
  proibicao_medica text,
  proibicao_medica_qual text,
  alergia_medicamento text,
  alergia_medicamento_qual text,
  tomando_remedio text,
  tomando_remedio_qual text,
  emergencia_nome text,
  emergencia_telefone text,
  igreja text,
  membro text,
  crente text,
  crente_anos text,
  outros text
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir insercao publica" ON registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir leitura apenas para autenticados" ON registrations
  FOR SELECT
  USING (auth.role() = 'authenticated');


-- 3. Storage Bucket para Imagens dos Eventos
-- Para criar o bucket via SQL, execute os comandos abaixo. 
-- (Você também pode criar um bucket público chamado 'event-covers' diretamente pelo painel do Supabase -> Storage).
insert into storage.buckets (id, name, public) 
values ('event-covers', 'event-covers', true) 
ON CONFLICT (id) DO NOTHING;

create policy "Imagens publicas" 
on storage.objects for select 
using ( bucket_id = 'event-covers' );

create policy "Admins podem inserir imagens" 
on storage.objects for insert 
with check ( bucket_id = 'event-covers' AND auth.role() = 'authenticated' );

create policy "Admins podem atualizar imagens" 
on storage.objects for update 
using ( bucket_id = 'event-covers' AND auth.role() = 'authenticated' );

create policy "Admins podem deletar imagens" 
on storage.objects for delete 
using ( bucket_id = 'event-covers' AND auth.role() = 'authenticated' );

-- 4. Atualizações do Módulo Financeiro (Admin V2)
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS status_pagamento text DEFAULT 'Pendente';
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS valor_pago numeric(10, 2) DEFAULT 0;

-- 5. Correção de Permissões (Permitir Admin atualizar pagamento)
DROP POLICY IF EXISTS "Admins podem atualizar inscricoes" ON registrations;
CREATE POLICY "Admins podem atualizar inscricoes" 
  ON registrations 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- 6. Atualizações de Gestão de Acampamento e Cantina
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS equipe text;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS quarto text;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS conselheiro text;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS saldo_cantina numeric(10, 2) DEFAULT 0;
