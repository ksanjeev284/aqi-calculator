import { SEO } from '../components/SEO';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCityAQI } from '../utils/api';
import { AQIFilters as AQIFiltersType } from '../types/aqi';
import { Loader2 } from 'lucide-react';
import { AQICard } from '../components/AQICard';
import { STATES } from '../types/aqi';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const [filters, setFilters] = useState<AQIFiltersType>({});
  const [showCharts, setShowCharts] = useState(false);
  const navigate = useNavigate();

  const { data: aqiData, isLoading, error } = useQuery({
    queryKey: ['aqi', filters],
    queryFn: () => fetchCityAQI(filters),
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  });

  const handleFilterChange = (field: keyof AQIFiltersType, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleShowCharts = () => {
    navigate('/city/delhi');
  };

  return (
    <>
      <SEO 
        title="India Air Quality Index (AQI) Monitor - Real-time Air Pollution Data"
        description="Monitor real-time Air Quality Index (AQI) across major Indian cities. Get detailed pollution levels, health recommendations, and historical air quality data."
      />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">AQI Calculator</h1>
          <button 
            onClick={handleShowCharts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            aria-label="View Air Quality Index charts"
          >
            Show Charts
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center my-6">
          India AQI Monitor
        </h2>
        
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <select
            id="state-filter"
            aria-label="Filter by state"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.state || ''}
            onChange={(e) => handleFilterChange('state', e.target.value)}
          >
            <option value="">All States</option>
            {STATES.map((state: string) => (
              <option key={state} value={state}>
                {state.replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            id="pollutant-filter"
            aria-label="Filter by pollutant type"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.parameter || ''}
            onChange={(e) => handleFilterChange('parameter', e.target.value)}
          >
            <option value="">All Pollutants</option>
            <option value="SO2">SO2</option>
            <option value="CO">CO</option>
            <option value="OZONE">Ozone</option>
          </select>

          <input
            type="text"
            id="city-filter"
            placeholder="Filter by city..."
            aria-label="Filter by city name"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />

          <input
            type="text"
            id="station-filter"
            placeholder="Filter by station..."
            aria-label="Filter by monitoring station"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.station || ''}
            onChange={(e) => handleFilterChange('station', e.target.value)}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg mb-6">
            {error instanceof Error ? error.message : 'An error occurred while fetching AQI data'}
          </div>
        )}

        {/* Data Display */}
        {aqiData && (
          <div>
            <div className="text-gray-600 mb-4">
              Showing {aqiData.length} monitoring stations
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aqiData.map((data, index) => (
                <AQICard 
                  key={`${data.city}-${data.station}-${data.parameter}-${index}`} 
                  data={data} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 