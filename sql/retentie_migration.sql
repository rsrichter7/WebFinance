-- Fase 7b: retentie-cron voor verlopen abonnementen
-- Draai dit in de Supabase SQL Editor. Verwijder dit bestand nadien uit de repo
-- (zelfde werkwijze als sql/loans_migration.sql eerder).

-- Tabel: houdt per huishouden bij sinds wanneer het abonnement/proefperiode verlopen is,
-- en welke stappen van de retentie-cron al zijn uitgevoerd.
create table household_retentie (
  household_id uuid primary key references households(id) on delete cascade,
  verlopen_sinds timestamptz not null default now(),
  waarschuwing_30d_verzonden boolean not null default false,
  waarschuwing_7d_verzonden boolean not null default false,
  data_gewist_op timestamptz,
  koppelingen_opgezegd boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS aan, geen policies: alleen de service_role (de cron) benadert deze tabel;
-- RLS blokkeert anon/authenticated automatisch omdat er geen policies gedefinieerd zijn.
alter table household_retentie enable row level security;

-- Functie: wist de financiële data van een huishouden na de retentietermijn.
-- Rekeningen verwijderen cascadeert (ON DELETE CASCADE) naar transactions, fixed_expenses,
-- budgets, savings_goals en loans. Households, household_members, profiles, user_settings
-- en subscriptions blijven bestaan, zodat het account (en een eventueel hernieuwd
-- abonnement) intact blijft.
create or replace function wis_household_data(p_household_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from rekeningen where household_id = p_household_id;
end;
$$;

revoke all on function wis_household_data(uuid) from public, anon, authenticated;
grant execute on function wis_household_data(uuid) to service_role;
