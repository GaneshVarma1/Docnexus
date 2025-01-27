import { Doctor } from '../graphql/generated';

export const exportToCSV = (doctors: Doctor[]) => {
  // Define all possible columns
  const headers = [
    'NPI Number',
    'Name',
    'Specialty',
    'Location',
    'Organization',
    'Health System',
    'Publications',
    'Clinical Trials',
    'Payments',
    'Life Science Firms',
    'Products',
    'Nature of Payments',
    'Total Amount',
    'Year',
    'Conditions',
    'Tags'
  ];

  const rows = doctors.map(doctor => [
    doctor.npi_number,
    doctor.name,
    doctor.specialty,
    doctor.city_state,
    doctor.hco,
    doctor.health_system,
    doctor.num_publications,
    doctor.num_clinical_trials,
    doctor.num_payments,
    doctor.life_science_firms,
    doctor.product,
    doctor.nature_of_payments,
    doctor.total_amount,
    doctor.year,
    doctor.conditions.join('; '),
    doctor.tags.join('; ')
  ]);

  // Escape special characters and wrap fields in quotes if they contain commas
  const escapeField = (field: any) => {
    const stringField = String(field);
    return stringField.includes(',') ? `"${stringField}"` : stringField;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeField).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `doctors_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}