import { generateMockDoctors } from "../utils/mockDataGenerator";

export interface Doctor {
  npi_number: string;
  name: string;
  specialty: string;
  hco: string;
  city_state: string;
  num_publications: number;
  num_clinical_trials: number;
  num_payments: number;
}

// Generate 200 mock doctors
export const doctors: Doctor[] = generateMockDoctors(200);

export interface Filter {
  id: string;
  label: string;
  type:
    | "select"
    | "date"
    | "text"
    | "multiselect"
    | "number-range"
    | "boolean"
    | "checkbox-group";
  options?: string[];
  group?: string;
  searchable?: boolean;
  allowSelectAll?: boolean;
  dependsOn?: string; // New field to indicate dependency
}

// Extract unique values from the generated doctors data
const uniqueStates = Array.from(
  new Set(doctors.map((doc) => doc.city_state.split(", ")[1]))
).sort();

export const filters: Filter[] = [
  // Location Information
  {
    id: "states",
    label: "States",
    type: "multiselect",
    options: uniqueStates,
    group: "Locations",
    searchable: true,
    allowSelectAll: true,
  },
  {
    id: "cities",
    label: "Cities",
    type: "multiselect",
    options: [], // Will be populated dynamically based on selected state
    group: "Locations",
    searchable: true,
    allowSelectAll: true,
    dependsOn: "states",
  },

  // Provider Information
  {
    id: "npi_number",
    label: "NPI Number",
    type: "text",
    group: "Provider",
    searchable: true,
  },
  {
    id: "name",
    label: "Name",
    type: "text",
    group: "Provider",
    searchable: true,
  },
  {
    id: "specialty",
    label: "Specialties",
    type: "multiselect",
    options: Array.from(
      new Set(
        doctors.flatMap((doc) => doc.specialty.split(", ").map((s) => s.trim()))
      )
    ).sort(),
    group: "Provider",
    searchable: true,
    allowSelectAll: true,
  },
];

// Helper function to get cities for selected states
export const getCitiesForSelectedStates = (
  selectedStates: string[]
): string[] => {
  if (selectedStates.length === 0) {
    return Array.from(
      new Set(doctors.map((doc) => doc.city_state.split(", ")[0]))
    ).sort();
  }

  return Array.from(
    new Set(
      doctors
        .filter((doc) => selectedStates.includes(doc.city_state.split(", ")[1]))
        .map((doc) => doc.city_state.split(", ")[0])
    )
  ).sort();
};
