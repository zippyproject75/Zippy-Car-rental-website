ALTER TABLE IF EXISTS customer_profiles RENAME TO legacy_customer_profiles;
ALTER TABLE IF EXISTS admin_activity_logs RENAME TO legacy_admin_activity_logs;

CREATE TABLE user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('SUPER_ADMIN', 'CUSTOMER')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX user_roles_single_super_admin
  ON user_roles (role)
  WHERE role = 'SUPER_ADMIN';

CREATE TABLE customer_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name varchar(100) NOT NULL DEFAULT '',
  phone varchar(30),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'CUSTOMER')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.customer_profiles (user_id, display_name)
  VALUES (
    NEW.id,
    left(COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'display_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'name', ''),
      split_part(COALESCE(NEW.email, ''), '@', 1)
    ), 100)
  )
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.customer_profiles
  SET phone = left(NULLIF(NEW.raw_user_meta_data ->> 'phone', ''), 30)
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  make text NOT NULL,
  model text NOT NULL,
  display_name text NOT NULL,
  variant text,
  unit_identifier text,
  fuel_type text,
  transmission text,
  seating_capacity smallint CHECK (seating_capacity IS NULL OR seating_capacity BETWEEN 1 AND 20),
  body_type text,
  description text NOT NULL DEFAULT '',
  is_available boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX vehicles_public_order_idx ON vehicles (is_published, display_order);

CREATE TABLE vehicle_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  alt_text text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX vehicle_photos_vehicle_order_idx ON vehicle_photos (vehicle_id, display_order);
CREATE UNIQUE INDEX vehicle_photos_one_primary_idx
  ON vehicle_photos (vehicle_id)
  WHERE is_primary;

CREATE TABLE vehicle_pricing (
  vehicle_id uuid NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  package_code text NOT NULL CHECK (package_code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  pricing_status text NOT NULL CHECK (pricing_status IN ('APPROVED', 'PENDING', 'PRICE_ON_REQUEST')),
  amount_inr numeric(12, 2) CHECK (amount_inr IS NULL OR amount_inr >= 0),
  included_km integer CHECK (included_km IS NULL OR included_km >= 0),
  extra_km_charge_inr numeric(12, 2) CHECK (extra_km_charge_inr IS NULL OR extra_km_charge_inr >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (vehicle_id, package_code),
  CHECK (
    (pricing_status = 'APPROVED' AND amount_inr IS NOT NULL)
    OR (pricing_status <> 'APPROVED' AND amount_inr IS NULL)
  )
);

CREATE TABLE pickup_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name_en text NOT NULL,
  name_hi text,
  name_mr text,
  address text NOT NULL DEFAULT '',
  locality text NOT NULL DEFAULT '',
  postal_code text,
  pickup_instructions text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TABLE enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES vehicles (id) ON DELETE SET NULL,
  vehicle_name_snapshot text,
  package_code text,
  pickup_location_id uuid REFERENCES pickup_locations (id) ON DELETE SET NULL,
  pickup_location_snapshot text,
  pickup_at timestamptz,
  return_at timestamptz,
  customer_name text,
  customer_note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'NEW' CHECK (status IN (
    'NEW', 'CONTACTED', 'AWAITING_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED'
  )),
  internal_notes text NOT NULL DEFAULT '',
  price_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX enquiries_status_created_idx ON enquiries (status, created_at DESC);

CREATE TABLE vehicle_pricing_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vehicle_id uuid NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  package_code text NOT NULL,
  previous_values jsonb NOT NULL,
  new_values jsonb NOT NULL,
  changed_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE policy_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en', 'hi', 'mr')),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  UNIQUE (slug, locale)
);

CREATE TABLE policy_document_versions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES policy_documents (id) ON DELETE CASCADE,
  version integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  is_published boolean NOT NULL,
  changed_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, version)
);

CREATE TABLE admin_activity_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  action varchar(100) NOT NULL,
  subject_type varchar(100),
  subject_id varchar(200),
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  request_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_activity_logs_created_at_idx ON admin_activity_logs (created_at DESC);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own profile"
  ON customer_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Customers can update own profile"
  ON customer_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Published vehicles are public"
  ON vehicles FOR SELECT TO anon, authenticated
  USING (is_published AND archived_at IS NULL);
CREATE POLICY "Photos for published vehicles are public"
  ON vehicle_photos FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM vehicles
    WHERE vehicles.id = vehicle_photos.vehicle_id
      AND vehicles.is_published
      AND vehicles.archived_at IS NULL
  ));
CREATE POLICY "Pricing for published vehicles is public"
  ON vehicle_pricing FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM vehicles
    WHERE vehicles.id = vehicle_pricing.vehicle_id
      AND vehicles.is_published
      AND vehicles.archived_at IS NULL
  ));
CREATE POLICY "Active pickup locations are public"
  ON pickup_locations FOR SELECT TO anon, authenticated
  USING (is_active AND archived_at IS NULL);
CREATE POLICY "Published policies are public"
  ON policy_documents FOR SELECT TO anon, authenticated
  USING (is_published);

CREATE FUNCTION public.prevent_admin_activity_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Administrative activity is append-only';
END;
$$;
CREATE TRIGGER admin_activity_logs_append_only
BEFORE UPDATE OR DELETE ON admin_activity_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_activity_mutation();

INSERT INTO vehicles (
  slug, make, model, display_name, unit_identifier, fuel_type, transmission,
  seating_capacity, body_type, is_available, is_published, is_featured, display_order
) VALUES
  ('fronx', 'Maruti Suzuki', 'Fronx', 'Maruti Suzuki Fronx', NULL, 'petrol-cng', 'manual', 5, 'compact-suv', false, true, false, 1),
  ('brezza', 'Maruti Suzuki', 'Brezza', 'Maruti Suzuki Brezza', NULL, 'diesel', 'manual', 5, 'compact-suv', false, true, false, 2),
  ('baleno', 'Maruti Suzuki', 'Baleno', 'Maruti Suzuki Baleno', NULL, 'petrol-cng', 'manual', 5, 'hatchback', false, true, false, 3),
  ('ertiga-1', 'Maruti Suzuki', 'Ertiga', 'Maruti Suzuki Ertiga', 'Unit 1', NULL, NULL, NULL, 'mpv', false, true, false, 4),
  ('xl6', 'Maruti Suzuki', 'XL6', 'Maruti Suzuki XL6', NULL, NULL, NULL, NULL, 'mpv', false, true, false, 5);

INSERT INTO vehicle_photos (vehicle_id, storage_path, alt_text, display_order, is_primary)
SELECT vehicles.id, photo.path, vehicles.display_name, photo.position, photo.is_primary
FROM vehicles
JOIN (VALUES
  ('fronx', '/images/cars/fronx.jpeg', 0, true),
  ('fronx', '/images/cars/fronx_front_view.png', 1, false),
  ('fronx', '/images/cars/fronx_side_view.png', 2, false),
  ('brezza', '/images/cars/brezza.jpeg', 0, true),
  ('brezza', '/images/cars/breeza_front_view.png', 1, false),
  ('brezza', '/images/cars/breeza_side_view.png', 2, false),
  ('baleno', '/images/cars/baleno.png', 0, true),
  ('baleno', '/images/cars/baleno_side_view.png', 1, false),
  ('ertiga-1', '/images/cars/ertiga.jpeg', 0, true),
  ('ertiga-1', '/images/cars/ertiga_front_view.png', 1, false),
  ('ertiga-1', '/images/cars/ertiga_side_view.png', 2, false),
  ('xl6', '/images/cars/XL6_front_view.png', 0, true),
  ('xl6', '/images/cars/XL6_side_view.png', 1, false)
) AS photo(slug, path, position, is_primary) ON photo.slug = vehicles.slug;

INSERT INTO vehicle_pricing (vehicle_id, package_code, pricing_status, amount_inr, included_km)
SELECT id, 'hourly',
       CASE slug WHEN 'fronx' THEN 'APPROVED' WHEN 'brezza' THEN 'APPROVED' WHEN 'baleno' THEN 'APPROVED' ELSE 'PENDING' END,
       CASE slug WHEN 'fronx' THEN 166 WHEN 'brezza' THEN 166 WHEN 'baleno' THEN 141 ELSE NULL END,
       NULL
FROM vehicles;
INSERT INTO vehicle_pricing (
  vehicle_id, package_code, pricing_status, amount_inr, included_km, extra_km_charge_inr
)
SELECT id, '12-hour',
       CASE slug WHEN 'fronx' THEN 'APPROVED' WHEN 'brezza' THEN 'APPROVED' WHEN 'baleno' THEN 'APPROVED' ELSE 'PENDING' END,
       CASE slug WHEN 'fronx' THEN 2000 WHEN 'brezza' THEN 2000 WHEN 'baleno' THEN 1700 ELSE NULL END,
       CASE WHEN slug IN ('fronx', 'brezza', 'baleno') THEN 180 ELSE NULL END,
       CASE WHEN slug IN ('fronx', 'brezza', 'baleno') THEN 10 ELSE NULL END
FROM vehicles;
INSERT INTO vehicle_pricing (vehicle_id, package_code, pricing_status, amount_inr)
SELECT id, '24-hour', 'PRICE_ON_REQUEST', NULL
FROM vehicles
WHERE slug IN ('fronx', 'brezza', 'baleno');
INSERT INTO vehicle_pricing (vehicle_id, package_code, pricing_status, amount_inr)
SELECT id, '24-hour', 'PENDING', NULL
FROM vehicles
WHERE slug IN ('ertiga-1', 'xl6');

INSERT INTO pickup_locations (slug, name_en, name_hi, name_mr, address, locality, postal_code)
VALUES
  ('home-delivery', 'Home Delivery', 'होम डिलीवरी', 'होम डिलिव्हरी', '', 'Pune', NULL),
  ('khadi-machine-chowk', 'Khadi Machine Chowk', 'खादी मशीन चौक', 'खादी मशीन चौक', 'Khadi Machine Chowk', 'Pune', '411048'),
  ('ganga-dham', 'Ganga Dham', 'गंगा धाम', 'गंगा धाम', 'Ganga Dham', 'Pune', '411048'),
  ('undri', 'Undri', 'उंड्री', 'उंड्री', 'Undri', 'Pune', '411060');
