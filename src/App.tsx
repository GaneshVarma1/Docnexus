import { useState, useMemo } from "react";
import { Search, Map as MapIcon, List, X, ArrowUpDown } from "lucide-react";
import { doctors, filters } from "./data/mockData";
import DoctorMap from "./components/DoctorMap";
import { Doctor } from "./types/doctor";
import FilterPanel from "./components/FilterPanel";
import { exportToCSV } from "./utils/csvExport";

interface FilterState {
  searchTerms: Record<string, string>;
  selectedValues: Record<string, string[]>;
  numberRanges: Record<string, { min: number; max: number }>;
  booleanValues: Record<string, boolean | null>;
}

type SortOption = {
  label: string;
  value: string;
  sortFn: (a: Doctor, b: Doctor) => number;
};

const sortOptions: SortOption[] = [
  {
    label: "Most Relevant",
    value: "relevant",
    sortFn: () => 0, // No sorting
  },
  {
    label: "Name A-Z",
    value: "name_asc",
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    label: "Name Z-A",
    value: "name_desc",
    sortFn: (a, b) => b.name.localeCompare(a.name),
  },
  {
    label: "Most Publications",
    value: "publications",
    sortFn: (a, b) => b.num_publications - a.num_publications,
  },
  {
    label: "Most Clinical Trials",
    value: "trials",
    sortFn: (a, b) => b.num_clinical_trials - a.num_clinical_trials,
  },
  {
    label: "Most Payments",
    value: "payments",
    sortFn: (a, b) => b.num_payments - a.num_payments,
  },
];

function App() {
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerms: {},
    selectedValues: {},
    numberRanges: {},
    booleanValues: {},
  });

  const [showMap, setShowMap] = useState(true);
  const [sortBy, setSortBy] = useState<string>("relevant");
  const [globalSearch, setGlobalSearch] = useState("");

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilterState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(filteredDoctors);
  };

  const filteredDoctors = useMemo(() => {
    let results = doctors.filter((doctor) => {
      // Global search
      if (globalSearch) {
        const searchTermLower = globalSearch.toLowerCase();
        const searchableFields = [
          doctor.name,
          doctor.specialty,
          doctor.hco,
          doctor.city_state,
          doctor.npi_number,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableFields.includes(searchTermLower)) {
          return false;
        }
      }

      // Filter by text searches
      for (const [key, searchTerm] of Object.entries(filterState.searchTerms)) {
        if (!searchTerm) continue;

        const value = doctor[key as keyof typeof doctor];
        if (
          typeof value === "string" &&
          !value.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
      }

      // Filter by multi-select values
      for (const [key, values] of Object.entries(filterState.selectedValues)) {
        if (!values.length) continue;

        if (key === "states") {
          const doctorState = doctor.city_state.split(", ")[1];
          if (!values.includes(doctorState)) {
            return false;
          }
          continue;
        }

        if (key === "cities") {
          const doctorCity = doctor.city_state.split(", ")[0];
          if (!values.includes(doctorCity)) {
            return false;
          }
          continue;
        }

        const value = doctor[key as keyof typeof doctor];
        if (typeof value === "string") {
          if (key === "specialty") {
            const doctorSpecialties = value.split(", ");
            if (!doctorSpecialties.some((spec) => values.includes(spec))) {
              return false;
            }
          } else if (!values.includes(value)) {
            return false;
          }
        }
      }

      // Filter by number ranges
      for (const [key, range] of Object.entries(filterState.numberRanges)) {
        const value = doctor[key as keyof typeof doctor];
        if (
          typeof value === "number" &&
          (value < range.min || value > range.max)
        ) {
          return false;
        }
        if (key === "total_amount" && value) {
          const numValue = parseFloat(
            value.toString().replace(/[^0-9.-]+/g, "")
          );
          if (numValue < range.min || numValue > range.max) {
            return false;
          }
        }
      }

      return true;
    });

    // Apply sorting
    const sortOption = sortOptions.find((option) => option.value === sortBy);
    if (sortOption) {
      results = [...results].sort(sortOption.sortFn);
    }

    return results;
  }, [filterState, globalSearch, sortBy]);

  // Modify the Results Grid section to handle pagination
  const paginatedDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDoctors.slice(startIndex, endIndex);
  }, [filteredDoctors, currentPage]);

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

  // Add this pagination controls component
  const PaginationControls = () => (
    <div className="flex items-center justify-between mt-4 py-4">
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, filteredDoctors.length)} of{" "}
        {filteredDoctors.length} results
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">DocNexus</h1>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, specialty, NPI, or organization..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none w-96"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Analytics
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Settings
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-6 flex gap-6">
        {/* Filters Sidebar */}
        <FilterPanel
          onFilterChange={handleFilterChange}
          onExportCSV={handleExportCSV}
        />

        {/* Results Area */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Results ({filteredDoctors.length} total, showing{" "}
                {paginatedDoctors.length} per page)
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  {showMap ? (
                    <List className="w-4 h-4" />
                  ) : (
                    <MapIcon className="w-4 h-4" />
                  )}
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <select
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(filterState.selectedValues).map(([key, values]) =>
                values.map((value) => (
                  <span
                    key={`${key}-${value}`}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                  >
                    {filters.find((f) => f.id === key)?.label}: {value}
                    <button
                      onClick={() => {
                        setFilterState((prev) => ({
                          ...prev,
                          selectedValues: {
                            ...prev.selectedValues,
                            [key]: prev.selectedValues[key].filter(
                              (v) => v !== value
                            ),
                          },
                        }));
                      }}
                      className="hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-4">
            {paginatedDoctors.map((doctor) => (
              <div
                key={doctor.npi_number}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      NPI: {doctor.npi_number}
                    </p>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    <p className="text-sm text-gray-500">{doctor.hco}</p>
                    {doctor.city_state && (
                      <p className="text-sm text-gray-500">
                        {doctor.city_state}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Publications: {doctor.num_publications}
                    </p>
                    <p className="text-sm text-gray-600">
                      Clinical Trials: {doctor.num_clinical_trials}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payments: {doctor.num_payments}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.specialty.split(", ").map((spec) => (
                    <span
                      key={spec}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <PaginationControls />
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="w-96 bg-white rounded-lg shadow-sm p-4 sticky top-24 h-[calc(100vh-8rem)]">
            <DoctorMap doctors={filteredDoctors} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
