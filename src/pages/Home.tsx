import { SEO } from '../components/SEO';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCityAQI } from '../utils/api';
import { AQIFilters as AQIFiltersType } from '../types/aqi';
import { Loader2 } from 'lucide-react';
import { AQICard } from '../components/AQICard';
import { STATES } from '../types/aqi';
import { AQICharts } from '../components/AQICharts';

export const Home = () => {
  const [filters, setFilters] = useState<AQIFiltersType>({});
  const [showCharts, setShowCharts] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

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

  const toggleCharts = () => {
    setShowCharts(prev => !prev);
    if (!showCharts) {
      setSelectedCity(null);
    }
  };

  const handleCityCardClick = (city: string) => {
    setSelectedCity(city);
    setShowCharts(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onClick={toggleCharts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            aria-label="Toggle Air Quality Index charts"
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
        </div>

        {/* Charts Section */}
        {showCharts && (
          <div className="mb-8">
            <AQICharts initialCity={selectedCity || filters.city} />
            {selectedCity && (
              <div className="text-center mt-4">
                <p className="text-lg font-semibold">Showing charts for {selectedCity}</p>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="text-blue-500 hover:text-blue-700 mt-2"
                >
                  Clear city selection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={filters.state || ''}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="p-2 border rounded-md"
            aria-label="Filter by state"
          >
            <option value="">All States</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="p-2 border rounded-md"
            aria-label="Filter by city"
          >
            <option value="">All Cities</option>
            {Array.from(new Set(aqiData?.map(d => d.city) || [])).sort().map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={filters.parameter || ''}
            onChange={(e) => handleFilterChange('parameter', e.target.value)}
            className="p-2 border rounded-md"
            aria-label="Filter by parameter"
          >
            <option value="">All Parameters</option>
            {Array.from(new Set(aqiData?.map(d => d.parameter) || [])).sort().map(param => (
              <option key={param} value={param}>{param}</option>
            ))}
          </select>
        </div>

        {/* AQI Cards Section */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            Error loading AQI data. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aqiData?.map((data, index) => (
              <AQICard 
                key={`${data.city}-${data.parameter}-${index}`} 
                data={data}
                onClick={handleCityCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};