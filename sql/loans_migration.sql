-- ─── Leningen tabel migratie ───
-- Voer uit in Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Bijhouden van aflossingen, rente en restschuld per huishouden.

CREATE TABLE IF NOT EXISTS loans (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id          uuid REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  naam                  text NOT NULL,
  type                  text NOT NULL,
  aflossingsvorm        text NOT NULL,
  oorspronkelijk_bedrag numeric(12,2) NOT NULL,
  huidig_saldo          numeric(12,2) NOT NULL,
  rente_percentage      numeric(6,3) NOT NULL DEFAULT 0,
  looptijd_maanden      integer NOT NULL,
  resterende_maanden    integer NOT NULL DEFAULT 0,
  startdatum            date NOT NULL,
  einddatum             date,
  wie                   text NOT NULL DEFAULT 'GZ',
  rekening              text DEFAULT '',
  notitie               text DEFAULT '',
  vaste_last_id         uuid REFERENCES fixed_expenses(id) ON DELETE SET NULL,
  created_at            timestamptz DEFAULT now() NOT NULL,

  CONSTRAINT loans_type_check CHECK (
    type IN ('Hypotheek', 'Studieschuld', 'Persoonlijke lening', 'Autolening')
  ),
  CONSTRAINT loans_aflossingsvorm_check CHECK (
    aflossingsvorm IN ('Annuitair', 'Lineair')
  )
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Huishouden leden kunnen eigen leningen beheren"
ON loans FOR ALL
USING (household_id = get_my_household_id())
WITH CHECK (household_id = get_my_household_id());

GRANT ALL ON loans TO authenticated;
