UPDATE vehicle_pricing AS pricing
SET extra_km_charge_inr = 10,
    updated_at = now()
FROM vehicles
WHERE pricing.vehicle_id = vehicles.id
  AND pricing.package_code = '12-hour'
  AND vehicles.slug IN ('fronx', 'brezza', 'baleno')
  AND pricing.extra_km_charge_inr IS NULL;
