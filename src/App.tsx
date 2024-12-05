import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCityAQI } from './utils/api';
import { AQICard } from './components/AQICard';
import { AQICharts } from './components/AQICharts';
import { STATES, POLLUTANTS, AQIFilters, AQIData } from './types/aqi';
import { Loader2 } from 'lucide-react';

function App() {
  const [filters, setFilters] = useState<AQIFilters>({});
  const [showCharts, setShowCharts] = useState(false);

  const { data: aqiData, isLoading, error } = useQuery({
    queryKey: ['aqi', filters],
    queryFn: () => fetchCityAQI(filters),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
  });

  const handleFilterChange = (filterType: keyof AQIFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === '' ? undefined : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AQI Calculator</h1>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showCharts ? 'Show Calculator' : 'Show Charts'}
          </button>
        </div>

        {showCharts ? (
          <AQICharts />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-8">India AQI Monitor</h1>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <select
                className="p-2 border rounded-lg"
                value={filters.state || ''}
                onChange={(e) => handleFilterChange('state', e.target.value)}
              >
                <option value="">All States</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>

              <select
                className="p-2 border rounded-lg"
                value={filters.parameter || ''}
                onChange={(e) => handleFilterChange('parameter', e.target.value)}
              >
                <option value="">All Pollutants</option>
                {POLLUTANTS.map((pollutant) => (
                  <option key={pollutant} value={pollutant}>
                    {pollutant}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Filter by city..."
                className="p-2 border rounded-lg"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />

              <input
                type="text"
                placeholder="Filter by station..."
                className="p-2 border rounded-lg"
                value={filters.station || ''}
                onChange={(e) => handleFilterChange('station', e.target.value)}
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
                {error instanceof Error ? error.message : 'An error occurred while fetching AQI data'}
              </div>
            )}

            {/* Data Display */}
            {aqiData && (
              <div>
                <div className="text-gray-600 mb-4">
                  Showing {aqiData.length} monitoring stations
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aqiData.map((data: AQIData, index: number) => (
                    <AQICard key={`${data.city}-${data.station}-${data.parameter}-${index}`} data={data} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;