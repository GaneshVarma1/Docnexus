import React, { useState, useCallback, useEffect } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown, Search, Download, X, Calendar, Sliders, RefreshCw } from 'lucide-react';
import { filters, getCitiesForSelectedStates } from '../data/mockData';

interface FilterPanelProps {
  onFilterChange: (filters: any) => void;
  onExportCSV: () => void;
}

interface FilterState {
  searchTerms: Record<string, string>;
  selectedValues: Record<string, string[]>;
  numberRanges: Record<string, { min: number; max: number }>;
}

const initialFilterState: FilterState = {
  searchTerms: {},
  selectedValues: {},
  numberRanges: {}
};

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, onExportCSV }) => {
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Update available cities when selected states change
  useEffect(() => {
    const selectedStates = filterState.selectedValues['states'] || [];
    const cities = getCitiesForSelectedStates(selectedStates);
    setAvailableCities(cities);

    // Clear selected cities that are no longer available
    const currentSelectedCities = filterState.selectedValues['cities'] || [];
    const validSelectedCities = currentSelectedCities.filter(city => cities.includes(city));
    
    if (validSelectedCities.length !== currentSelectedCities.length) {
      const newState = {
        ...filterState,
        selectedValues: {
          ...filterState.selectedValues,
          cities: validSelectedCities
        }
      };
      updateFilters(newState);
    }
  }, [filterState.selectedValues['states']]);

  const updateFilters = useCallback((newState: FilterState) => {
    setFilterState(newState);
    onFilterChange(newState);
  }, [onFilterChange]);

  const handleClearAllFilters = () => {
    setFilterState(initialFilterState);
    setSearchQueries({});
    onFilterChange(initialFilterState);
  };

  const handleTagSelect = (filterId: string, value: string) => {
    if (value === 'All') {
      const newState = {
        ...filterState,
        selectedValues: {
          ...filterState.selectedValues,
          [filterId]: []
        }
      };
      updateFilters(newState);
      return;
    }

    const newState = {
      ...filterState,
      selectedValues: {
        ...filterState.selectedValues,
        [filterId]: [...(filterState.selectedValues[filterId] || []), value]
      }
    };
    updateFilters(newState);
  };

  const handleTagRemove = (filterId: string, value: string) => {
    const newState = {
      ...filterState,
      selectedValues: {
        ...filterState.selectedValues,
        [filterId]: filterState.selectedValues[filterId]?.filter(v => v !== value) || []
      }
    };
    updateFilters(newState);
  };

  const handleSearchChange = (filterId: string, query: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [filterId]: query
    }));

    if (filters.find(f => f.id === filterId)?.type === 'text') {
      const newState = {
        ...filterState,
        searchTerms: {
          ...filterState.searchTerms,
          [filterId]: query
        }
      };
      updateFilters(newState);
    }
  };

  const handleRangeChange = (filterId: string, value: { min: number; max: number }) => {
    const newState = {
      ...filterState,
      numberRanges: {
        ...filterState.numberRanges,
        [filterId]: value
      }
    };
    updateFilters(newState);
  };

  const renderFilterContent = (filter: typeof filters[0]) => {
    const selectedValues = filterState.selectedValues[filter.id] || [];
    const searchQuery = searchQueries[filter.id] || '';

    // Use available cities for the cities filter, otherwise use filter's options
    const options = filter.id === 'cities' ? availableCities : filter.options;

    switch (filter.type) {
      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.searchable && (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${filter.label.toLowerCase()}...`}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(filter.id, e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2 max-h-[300px] overflow-y-auto">
              {options
                ?.filter(option => 
                  !searchQuery || 
                  option.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(option => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => isSelected 
                        ? handleTagRemove(filter.id, option)
                        : handleTagSelect(filter.id, option)
                      }
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        isSelected 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                      {isSelected && (
                        <X 
                          className="w-3 h-3 ml-2" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagRemove(filter.id, option);
                          }} 
                        />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${filter.label.toLowerCase()}...`}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filterState.searchTerms[filter.id] || ''}
              onChange={(e) => handleSearchChange(filter.id, e.target.value)}
            />
          </div>
        );

      case 'number-range':
        const range = filterState.numberRanges[filter.id] || { min: 0, max: 100 };
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Min"
                className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-md"
                value={range.min}
                onChange={(e) => handleRangeChange(filter.id, {
                  ...range,
                  min: parseInt(e.target.value) || 0
                })}
              />
              <Sliders className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Max"
                className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-md"
                value={range.max}
                onChange={(e) => handleRangeChange(filter.id, {
                  ...range,
                  max: parseInt(e.target.value) || 100
                })}
              />
            </div>
            <input
              type="range"
              className="w-full"
              min="0"
              max="100"
              value={range.max}
              onChange={(e) => handleRangeChange(filter.id, {
                ...range,
                max: parseInt(e.target.value)
              })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const filterGroups = [
    {
      title: 'Locations',
      icon: '🌍',
      filters: filters.filter(f => f.group === 'Locations')
    },
    {
      title: 'Provider',
      icon: '👨‍⚕️',
      filters: filters.filter(f => f.group === 'Provider')
    }
  ];

  const hasActiveFilters = Object.keys(filterState.selectedValues).length > 0 || 
                          Object.keys(filterState.searchTerms).length > 0 || 
                          Object.keys(filterState.numberRanges).length > 0;

  return (
    <aside className="w-80 bg-white rounded-lg shadow-sm p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              title="Clear all filters"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Clear
            </button>
          )}
        </div>
        <button
          onClick={onExportCSV}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="space-y-2">
        {filterGroups.map((group) => (
          <Disclosure key={group.title} defaultOpen>
            {({ open }) => (
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <Disclosure.Button className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50">
                  <span className="flex items-center gap-2">
                    <span>{group.icon}</span>
                    <span className="font-medium text-gray-900">{group.title}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      open ? 'transform rotate-180' : ''
                    }`}
                  />
                </Disclosure.Button>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pb-4 pt-2 space-y-4">
                    {group.filters.map((filter) => (
                      <div key={filter.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {filter.label}
                        </label>
                        {renderFilterContent(filter)}
                      </div>
                    ))}
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </aside>
  );
};

export default FilterPanel;