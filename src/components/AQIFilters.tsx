import React from 'react';
import { AQIFilters as AQIFiltersType, STATES, POLLUTANTS } from '../types/aqi';

interface AQIFiltersProps {
  filters: AQIFiltersType;
  onFilterChange: (filters: AQIFiltersType) => void;
}

export const AQIFilters: React.FC<AQIFiltersProps> = ({ filters, onFilterChange }) => {
  const handleChange = (field: keyof AQIFiltersType) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onFilterChange({
      ...filters,
      [field]: e.target.value || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          value={filters.state || ''}
          onChange={handleChange('state')}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All States</option>
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          value={filters.city || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              city: e.target.value || undefined,
            })
          }
          placeholder="Enter city name"
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pollutant
        </label>
        <select
          value={filters.pollutant_id || ''}
          onChange={handleChange('pollutant_id')}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Pollutants</option>
          {POLLUTANTS.map((pollutant) => (
            <option key={pollutant} value={pollutant}>
              {pollutant}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Station
        </label>
        <input
          type="text"
          value={filters.station || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              station: e.target.value || undefined,
            })
          }
          placeholder="Enter station name"
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
