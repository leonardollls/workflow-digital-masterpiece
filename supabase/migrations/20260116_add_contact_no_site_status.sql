-- Migração: Adicionar status "Entrar em Contato (Sem site)" ao enum proposal_status
-- Data: 2026-01-16
-- Descrição: Adiciona novo valor 'contact_no_site' ao enum proposal_status para identificar
--            estabelecimentos que precisam ser contactados mas não possuem site

-- Adicionar novo valor ao enum proposal_status
DO $$ 
BEGIN
    -- Verificar se o valor já existe antes de adicionar
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'contact_no_site' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'proposal_status')
    ) THEN
        ALTER TYPE proposal_status ADD VALUE 'contact_no_site';
    END IF;
END $$;

-- Comentário explicativo
COMMENT ON TYPE proposal_status IS 'Status das propostas comerciais: pending (Pendente), to_send (A Enviar), accepted (Aceita), rejected (Negada), in_progress (Em Execução), paid (Pago), contact_no_site (Entrar em Contato - Sem site)';
