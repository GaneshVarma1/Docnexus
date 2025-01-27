import { Doctor } from "../graphql/generated";

// Complete list of US states with abbreviations
const states = [
  { name: "Alabama", abbr: "AL" },
  { name: "Alaska", abbr: "AK" },
  { name: "Arizona", abbr: "AZ" },
  { name: "Arkansas", abbr: "AR" },
  { name: "California", abbr: "CA" },
  { name: "Colorado", abbr: "CO" },
  { name: "Connecticut", abbr: "CT" },
  { name: "Delaware", abbr: "DE" },
  { name: "Florida", abbr: "FL" },
  { name: "Georgia", abbr: "GA" },
  { name: "Hawaii", abbr: "HI" },
  { name: "Idaho", abbr: "ID" },
  { name: "Illinois", abbr: "IL" },
  { name: "Indiana", abbr: "IN" },
  { name: "Iowa", abbr: "IA" },
  { name: "Kansas", abbr: "KS" },
  { name: "Kentucky", abbr: "KY" },
  { name: "Louisiana", abbr: "LA" },
  { name: "Maine", abbr: "ME" },
  { name: "Maryland", abbr: "MD" },
  { name: "Massachusetts", abbr: "MA" },
  { name: "Michigan", abbr: "MI" },
  { name: "Minnesota", abbr: "MN" },
  { name: "Mississippi", abbr: "MS" },
  { name: "Missouri", abbr: "MO" },
  { name: "Montana", abbr: "MT" },
  { name: "Nebraska", abbr: "NE" },
  { name: "Nevada", abbr: "NV" },
  { name: "New Hampshire", abbr: "NH" },
  { name: "New Jersey", abbr: "NJ" },
  { name: "New Mexico", abbr: "NM" },
  { name: "New York", abbr: "NY" },
  { name: "North Carolina", abbr: "NC" },
  { name: "North Dakota", abbr: "ND" },
  { name: "Ohio", abbr: "OH" },
  { name: "Oklahoma", abbr: "OK" },
  { name: "Oregon", abbr: "OR" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Rhode Island", abbr: "RI" },
  { name: "South Carolina", abbr: "SC" },
  { name: "South Dakota", abbr: "SD" },
  { name: "Tennessee", abbr: "TN" },
  { name: "Texas", abbr: "TX" },
  { name: "Utah", abbr: "UT" },
  { name: "Vermont", abbr: "VT" },
  { name: "Virginia", abbr: "VA" },
  { name: "Washington", abbr: "WA" },
  { name: "West Virginia", abbr: "WV" },
  { name: "Wisconsin", abbr: "WI" },
  { name: "Wyoming", abbr: "WY" },
];

// Major US cities by state
const cities = {
  AL: ["Birmingham", "Montgomery", "Huntsville", "Mobile"],
  AK: ["Anchorage", "Fairbanks", "Juneau", "Sitka"],
  AZ: ["Phoenix", "Tucson", "Mesa", "Chandler"],
  AR: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"],
  CA: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
  CO: ["Denver", "Colorado Springs", "Aurora", "Fort Collins"],
  CT: ["Bridgeport", "New Haven", "Hartford", "Stamford"],
  DE: ["Wilmington", "Dover", "Newark", "Middletown"],
  FL: ["Miami", "Orlando", "Tampa", "Jacksonville"],
  GA: ["Atlanta", "Savannah", "Augusta", "Columbus"],
  HI: ["Honolulu", "Hilo", "Kailua", "Kapolei"],
  ID: ["Boise", "Meridian", "Nampa", "Idaho Falls"],
  IL: ["Chicago", "Aurora", "Rockford", "Joliet"],
  IN: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"],
  IA: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"],
  KS: ["Wichita", "Overland Park", "Kansas City", "Olathe"],
  KY: ["Louisville", "Lexington", "Bowling Green", "Owensboro"],
  LA: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"],
  ME: ["Portland", "Lewiston", "Bangor", "South Portland"],
  MD: ["Baltimore", "Columbia", "Annapolis", "Frederick"],
  MA: ["Boston", "Worcester", "Springfield", "Cambridge"],
  MI: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights"],
  MN: ["Minneapolis", "Saint Paul", "Rochester", "Duluth"],
  MS: ["Jackson", "Gulfport", "Southaven", "Biloxi"],
  MO: ["Kansas City", "St. Louis", "Springfield", "Columbia"],
  MT: ["Billings", "Missoula", "Great Falls", "Bozeman"],
  NE: ["Omaha", "Lincoln", "Bellevue", "Grand Island"],
  NV: ["Las Vegas", "Reno", "Henderson", "North Las Vegas"],
  NH: ["Manchester", "Nashua", "Concord", "Dover"],
  NJ: ["Newark", "Jersey City", "Paterson", "Elizabeth"],
  NM: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"],
  NY: ["New York City", "Buffalo", "Rochester", "Syracuse"],
  NC: ["Charlotte", "Raleigh", "Greensboro", "Durham"],
  ND: ["Fargo", "Bismarck", "Grand Forks", "Minot"],
  OH: ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  OK: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"],
  OR: ["Portland", "Salem", "Eugene", "Gresham"],
  PA: ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
  RI: ["Providence", "Warwick", "Cranston", "Pawtucket"],
  SC: ["Columbia", "Charleston", "North Charleston", "Mount Pleasant"],
  SD: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"],
  TN: ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
  TX: ["Houston", "Dallas", "Austin", "San Antonio"],
  UT: ["Salt Lake City", "West Valley City", "Provo", "West Jordan"],
  VT: ["Burlington", "South Burlington", "Rutland", "Barre"],
  VA: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond"],
  WA: ["Seattle", "Spokane", "Tacoma", "Vancouver"],
  WV: ["Charleston", "Huntington", "Parkersburg", "Morgantown"],
  WI: ["Milwaukee", "Madison", "Green Bay", "Kenosha"],
  WY: ["Cheyenne", "Casper", "Laramie", "Gillette"],
};

const specialties = [
  "BLOOD BANKING & TRANSFUSION MEDICINE",
  "PATHOLOGY",
  "ONCOLOGY",
  "HEMATOLOGY",
  "CARDIOLOGY",
  "NEUROLOGY",
  "PEDIATRICS",
  "INTERNAL MEDICINE",
  "SURGERY",
  "DERMATOLOGY",
  "PSYCHIATRY",
  "RADIOLOGY",
  "ORTHOPEDICS",
  "UROLOGY",
  "ENDOCRINOLOGY",
];

const hospitals = [
  "University Medical Center",
  "Memorial Hospital",
  "Regional Medical Center",
  "Community Hospital",
  "Children's Hospital",
  "Veterans Hospital",
  "General Hospital",
  "Methodist Hospital",
  "Baptist Medical Center",
  "Presbyterian Hospital",
];

const healthSystems = [
  "UT Southwestern Health",
  "Houston Methodist",
  "Mayo Clinic",
  "Cleveland Clinic",
  "Johns Hopkins Medicine",
  "Kaiser Permanente",
  "Ascension Health",
  "HCA Healthcare",
  "Trinity Health",
  "CommonSpirit Health",
];

const conditions = [
  "Leukemia",
  "Lymphoma",
  "Blood Disorders",
  "Breast Cancer",
  "Lung Cancer",
  "Melanoma",
  "Heart Disease",
  "Diabetes",
  "Hypertension",
  "Alzheimer's",
  "Parkinson's",
  "Multiple Sclerosis",
];

const tags = [
  "Research Focus",
  "Clinical Trials",
  "Academic",
  "Private Practice",
  "Teaching",
  "Publications",
  "Innovation",
  "Leadership",
  "Patient Care",
  "Community Outreach",
];

const lifeScienceFirms = [
  "Novartis",
  "Pfizer",
  "Bristol Myers Squibb",
  "Merck",
  "Johnson & Johnson",
  "Roche",
  "AstraZeneca",
  "Gilead",
  "Amgen",
  "Moderna",
  "Eli Lilly",
  "GlaxoSmithKline",
];

const products = [
  "KYMRIAH",
  "CARVYKTI",
  "OPDIVO",
  "KEYTRUDA",
  "HUMIRA",
  "REVLIMID",
  "ELIQUIS",
  "IMBRUVICA",
  "RITUXAN",
  "AVASTIN",
  "HERCEPTIN",
  "TECENTRIQ",
];

const natureOfPayments = [
  "Consulting",
  "Research",
  "Speaking",
  "Travel",
  "Education",
  "Royalty",
  "Grant",
  "Honoraria",
];

function generateRandomNPI() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomName() {
  const firstNames = [
    "James",
    "John",
    "Robert",
    "Michael",
    "William",
    "David",
    "Richard",
    "Joseph",
    "Thomas",
    "Sarah",
    "Elizabeth",
    "Mary",
    "Patricia",
    "Jennifer",
    "Linda",
    "Barbara",
    "Susan",
    "Margaret",
    "Jessica",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
  ];

  return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
}

function getRandomLocation() {
  const state = getRandomElement(states);
  const stateCities = cities[state.abbr as keyof typeof cities];
  const city = getRandomElement(stateCities);
  return `${city}, ${state.abbr}`;
}

export function generateMockDoctors(count: number): Doctor[] {
  return Array.from({ length: count }, () => {
    const selectedSpecialties = getRandomElements(
      specialties,
      Math.floor(Math.random() * 3) + 1
    );

    return {
      npi_number: generateRandomNPI(),
      name: generateRandomName(),
      specialty: selectedSpecialties.join(", "),
      city_state: getRandomLocation(),
      hco: getRandomElement(hospitals),
      health_system: getRandomElement(healthSystems),
      num_publications: Math.floor(Math.random() * 100),
      num_clinical_trials: Math.floor(Math.random() * 50),
      num_payments: Math.floor(Math.random() * 30),
      conditions: getRandomElements(
        conditions,
        Math.floor(Math.random() * 4) + 1
      ),
      tags: getRandomElements(tags, Math.floor(Math.random() * 3) + 1),
      life_science_firms: getRandomElements(
        lifeScienceFirms,
        Math.floor(Math.random() * 4) + 1
      ).join(", "),
      product: getRandomElements(
        products,
        Math.floor(Math.random() * 3) + 1
      ).join(", "),
      nature_of_payments: getRandomElements(
        natureOfPayments,
        Math.floor(Math.random() * 3) + 1
      ).join(", "),
      total_amount: `$${(Math.random() * 100000).toFixed(2)}`,
      year: ["2021", "2022", "2023", "2024"][Math.floor(Math.random() * 4)],
    } as Doctor;
  });
}
