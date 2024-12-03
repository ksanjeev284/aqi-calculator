import React from 'react';
import { INDIAN_CITIES } from '../utils/constants';
import { CityOption } from '../types/aqi';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onCityChange }) => {
  return (
    <div className="w-full max-w-md">
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        {INDIAN_CITIES.map((city: CityOption) => (
          <option key={city.value} value={city.value}>
            {city.label}
          </option>
        ))}
      </select>
    </div>
  );
};