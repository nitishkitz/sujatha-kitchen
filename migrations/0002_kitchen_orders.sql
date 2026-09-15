create table if not exists kitchen_orders (
  id text primary key,
  status text not null check (status in ('pending', 'preparing', 'ready', 'completed')),
  customer_name text not null,
  phone text not null,
  slot text not null default 'ASAP · 15–20 min',
  pay text not null default 'upi',
  lines jsonb not null default '[]'::jsonb,
  total integer not null,
  summary text not null,
  items integer not null,
  placed_at timestamptz not null default now(),
  preparing_at timestamptz,
  ready_at timestamptz,
  collected_at timestamptz,
  updated_by text
);

create index if not exists kitchen_orders_placed_at_idx on kitchen_orders (placed_at desc);
create index if not exists kitchen_orders_status_idx on kitchen_orders (status);

create table if not exists kitchen_menu_flags (
  item_id text primary key,
  available boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into kitchen_orders (
  id, status, customer_name, phone, slot, pay, lines, total, summary, items, placed_at, preparing_at, ready_at, collected_at
) values
(
  'A47', 'preparing', 'Alex', '9876543210', 'ASAP · 15–20 min', 'upi',
  '[{"name":"Chicken Curry (Full)","note":"Less spicy","qty":1,"price":80},{"name":"Tea","qty":1,"price":20}]'::jsonb,
  100, 'Chicken Curry + Tea', 2,
  now() - interval '12 minutes', now() - interval '10 minutes', null, null
),
(
  'A46', 'ready', 'Priya', '9848012345', 'ASAP · 15–20 min', 'cash',
  '[{"name":"Veg meals","qty":1,"price":100}]'::jsonb,
  100, 'Veg Meals', 1,
  now() - interval '16 minutes', now() - interval '14 minutes', now() - interval '4 minutes', null
),
(
  'A45', 'ready', 'Ravi', '9900112233', 'ASAP · 15–20 min', 'upi',
  '[{"name":"Chapati (2 pcs)","qty":1,"price":30},{"name":"Egg Curry","qty":1,"price":40}]'::jsonb,
  70, 'Chapati + Egg Curry', 2,
  now() - interval '23 minutes', now() - interval '21 minutes', now() - interval '8 minutes', null
),
(
  'A44', 'preparing', 'Meena', '9123456780', 'ASAP · 15–20 min', 'upi',
  '[{"name":"Veg Maggi","qty":1,"price":40}]'::jsonb,
  40, 'Veg Maggi', 1,
  now() - interval '26 minutes', now() - interval '24 minutes', null, null
),
(
  'A43', 'completed', 'Arun', '9012345678', 'ASAP · 15–20 min', 'cash',
  '[{"name":"Samosa","qty":1,"price":20},{"name":"Tea","qty":1,"price":20}]'::jsonb,
  40, 'Samosa + Tea', 2,
  now() - interval '40 minutes', now() - interval '38 minutes', now() - interval '28 minutes', now() - interval '22 minutes'
),
(
  'A50', 'pending', 'Sana', '9988776655', 'ASAP · 15–20 min', 'upi',
  '[{"name":"Egg Maggi","qty":1,"price":50}]'::jsonb,
  50, 'Egg Maggi', 1,
  now() - interval '4 minutes', null, null, null
),
(
  'A51', 'pending', 'Kiran', '9000001111', 'ASAP · 15–20 min', 'upi',
  '[{"name":"Chicken Curry (Full)","qty":1,"price":80},{"name":"Chapati (2 pcs)","qty":1,"price":30}]'::jsonb,
  110, 'Chicken Curry + Chapati', 2,
  now() - interval '2 minutes', null, null, null
),
(
  'A52', 'pending', 'Neha', '9090909090', 'ASAP · 15–20 min', 'cash',
  '[{"name":"Veg meals","qty":1,"price":100}]'::jsonb,
  100, 'Veg Meals', 1,
  now() - interval '1 minute', null, null, null
)
on conflict (id) do nothing;
