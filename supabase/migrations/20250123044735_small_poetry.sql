/*
  # Create doctors table with indexes for performance

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `npi_number` (text, unique, indexed)
      - `name` (text, indexed)
      - `specialty` (text, indexed)
      - `city` (text, indexed)
      - `state` (text, indexed)
      - `hco` (text)
      - `health_system` (text)
      - `num_publications` (integer)
      - `num_clinical_trials` (integer)
      - `num_payments` (integer)
      - Timestamps for tracking

  2. Indexes
    - Added indexes on frequently queried columns
    - Added composite indexes for common query patterns
    
  3. Security
    - Enabled RLS
    - Added policy for public read access
*/

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  npi_number text UNIQUE NOT NULL,
  name text NOT NULL,
  specialty text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  hco text NOT NULL,
  health_system text NOT NULL,
  num_publications integer DEFAULT 0,
  num_clinical_trials integer DEFAULT 0,
  num_payments integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS doctors_npi_number_idx ON doctors(npi_number);
CREATE INDEX IF NOT EXISTS doctors_name_idx ON doctors(name);
CREATE INDEX IF NOT EXISTS doctors_specialty_idx ON doctors(specialty);
CREATE INDEX IF NOT EXISTS doctors_city_idx ON doctors(city);
CREATE INDEX IF NOT EXISTS doctors_state_idx ON doctors(state);
CREATE INDEX IF NOT EXISTS doctors_location_idx ON doctors(state, city);

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to doctors"
  ON doctors
  FOR SELECT
  TO public
  USING (true);

-- Add updated_at trigger
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