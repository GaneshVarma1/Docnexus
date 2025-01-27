/*
  # Add performance optimizations for doctors table

  1. Indexes
    - Added indexes for frequently queried columns:
      - npi_number
      - name
      - specialty
      - city
      - state
    - Added composite index for location queries (state, city)

  2. Changes
    - Added indexes to improve query performance
    - Added trigger for updated_at timestamp
*/

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS doctors_npi_number_idx ON doctors(npi_number);
CREATE INDEX IF NOT EXISTS doctors_name_idx ON doctors(name);
CREATE INDEX IF NOT EXISTS doctors_specialty_idx ON doctors(specialty);
CREATE INDEX IF NOT EXISTS doctors_city_idx ON doctors(city);
CREATE INDEX IF NOT EXISTS doctors_state_idx ON doctors(state);
CREATE INDEX IF NOT EXISTS doctors_location_idx ON doctors(state, city);

-- Add updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_doctors_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_doctors_updated_at
      BEFORE UPDATE ON doctors
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;