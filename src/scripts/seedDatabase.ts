import { supabase } from '../lib/supabase';
import { generateMockDoctors } from '../utils/mockDataGenerator';

async function seedDatabase() {
  const mockDoctors = generateMockDoctors(200);
  
  // Transform the data to match the database schema
  const doctorsData = mockDoctors.map(doctor => ({
    npi_number: doctor.npi_number,
    name: doctor.name,
    specialty: doctor.specialty,
    city: doctor.city_state.split(', ')[0],
    state: doctor.city_state.split(', ')[1],
    hco: doctor.hco,
    health_system: doctor.health_system,
    num_publications: doctor.num_publications,
    num_clinical_trials: doctor.num_clinical_trials,
    num_payments: doctor.num_payments
  }));

  const { data, error } = await supabase
    .from('doctors')
    .insert(doctorsData);

  if (error) {
    console.error('Error seeding database:', error);
    return;
  }

  console.log('Successfully seeded database with mock data');
}

seedDatabase();