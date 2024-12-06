import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchCityAQI } from '../utils/api';
import { AQIData } from '../types/aqi';
import { Loader2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Air Quality Index Trends by Pollutant',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'AQI Value',
      },
    },
  },
};

export const AQICharts: React.FC<{ initialCity?: string }> = ({ initialCity }) => {
  const [selectedCity, setSelectedCity] = useState<string>(initialCity || '');

  // Fetch all AQI data without city filter
  const { data: aqiData, isLoading, error } = useQuery({
    queryKey: ['aqi'],
    queryFn: () => fetchCityAQI({}),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const { cities, chartData, currentAQI } = useMemo(() => {
    if (!aqiData) {
      return { cities: [], chartData: null, currentAQI: null };
    }

    // Get unique cities
    const uniqueCities = Array.from(new Set(aqiData.map(d => d.city))).sort();

    // Set initial selected city if not set
    if (!selectedCity && uniqueCities.length > 0) {
      setSelectedCity(uniqueCities[0]);
    }

    // Filter data for selected city
    const cityData = selectedCity ? aqiData.filter(d => d.city === selectedCity) : [];

    // Group data by pollutant
    const pollutantGroups = cityData.reduce((acc, curr) => {
      if (!acc[curr.parameter]) {
        acc[curr.parameter] = [];
      }
      acc[curr.parameter].push(curr);
      return acc;
    }, {} as Record<string, AQIData[]>);

    // Create chart data
    const chartData = {
      labels: Object.keys(pollutantGroups),
      datasets: [
        {
          label: 'Current AQI',
          data: Object.values(pollutantGroups).map(group => 
            group[0]?.value || 0
          ),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Max AQI',
          data: Object.values(pollutantGroups).map(group =>
            group[0]?.maxValue || 0
          ),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Min AQI',
          data: Object.values(pollutantGroups).map(group =>
            group[0]?.minValue || 0
          ),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };

    // Calculate overall AQI (maximum of all pollutants)
    const currentAQI = cityData.length > 0 
      ? Math.max(...cityData.map(d => d.value))
      : null;

    return { cities: uniqueCities, chartData, currentAQI };
  }, [aqiData, selectedCity]);

  const getAQIStatus = (value: number) => {
    if (value <= 50) return { text: 'Good', color: 'text-green-500' };
    if (value <= 100) return { text: 'Moderate', color: 'text-yellow-500' };
    if (value <= 150) return { text: 'Unhealthy for Sensitive Groups', color: 'text-orange-500' };
    if (value <= 200) return { text: 'Unhealthy', color: 'text-red-500' };
    if (value <= 300) return { text: 'Very Unhealthy', color: 'text-purple-500' };
    return { text: 'Hazardous', color: 'text-red-900' };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
        An error occurred while fetching AQI data
      </div>
    );
  }

  const status = currentAQI ? getAQIStatus(currentAQI) : { text: 'Unknown', color: 'text-gray-500' };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select City
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {chartData && selectedCity && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Current AQI Status for {selectedCity}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{currentAQI?.toFixed(1)}</span>
              <span className={`${status.color} font-medium`}>{status.text}</span>
            </div>
          </div>
          <Line options={chartOptions} data={chartData} />
          <div className="mt-4 text-sm text-gray-500">
            Shows current, minimum, and maximum AQI values for each pollutant
          </div>
        </div>
      )}
    </div>
  );
};
