import axios from 'axios';
import { AQIData, AQIFilters, APIResponse, APIRecord } from '../types/aqi';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!API_KEY || !BASE_URL) {
  console.error('Environment variables are not properly configured. Please check your .env file or environment settings.');
}

const api = axios.create({
  timeout: 15000,
});

const parseNumericValue = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

const formatDate = (dateStr: string): string => {
  // Check if the date is in the expected format (dd-mm-yyyy HH:mm:ss)
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/;
  const match = dateStr.match(dateRegex);
  
  if (!match) {
    console.warn('Invalid date format:', dateStr);
    return new Date().toISOString(); // Return current time if format is invalid
  }

  // Extract components from the match
  const [, day, month, year, hours, minutes, seconds] = match;
  
  // Create a date string in ISO format (yyyy-mm-ddTHH:mm:ss)
  const isoDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`; // Adding IST offset
  
  try {
    // Validate the date
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr);
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return new Date().toISOString();
  }
};

export const fetchCityAQI = async (filters: AQIFilters): Promise<AQIData[]> => {
  try {
    // First, get the total count of records
    const countResponse = await api.get<APIResponse>(BASE_URL, {
      params: {
        'api-key': API_KEY,
        format: 'json',
        limit: 1,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) {
            if (key === 'parameter') {
              acc['filters[pollutant_id]'] = value;
            } else {
              acc[`filters[${key}]`] = value;
            }
          }
          return acc;
        }, {} as Record<string, string>),
      },
    });

    const totalRecords = countResponse.data.total;
    const batchSize = 500; // API's maximum limit per request

    // Calculate number of batches needed
    const batches = Math.ceil(totalRecords / batchSize);
    const allRecords: APIRecord[] = [];

    // Fetch all batches
    for (let i = 0; i < batches; i++) {
      const response = await api.get<APIResponse>(BASE_URL, {
        params: {
          'api-key': API_KEY,
          format: 'json',
          limit: batchSize,
          offset: i * batchSize,
          ...Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) {
              if (key === 'parameter') {
                acc['filters[pollutant_id]'] = value;
              } else {
                acc[`filters[${key}]`] = value;
              }
            }
            return acc;
          }, {} as Record<string, string>),
        },
      });

      if (response.data?.records) {
        allRecords.push(...response.data.records);
      }
    }

    if (allRecords.length === 0) {
      throw new Error('No data available');
    }

    const validRecords = allRecords
      .map((record: APIRecord) => {
        try {
          // Check if all required fields are present
          if (!record.city || !record.pollutant_id || !record.state || !record.station) {
            console.warn(`Skipping record with missing required fields for ${record.city || 'unknown city'}`);
            return null;
          }

          // Parse all numeric values with fallback to 0
          const avgValue = parseNumericValue(record.avg_value);
          const minValue = parseNumericValue(record.min_value);
          const maxValue = parseNumericValue(record.max_value);

          // Skip records with all zero values
          if (avgValue === 0 && minValue === 0 && maxValue === 0) {
            console.warn(`Skipping record with all zero values for ${record.pollutant_id} in ${record.city}`);
            return null;
          }

          // Format the date properly
          const formattedDate = formatDate(record.last_update);

          const aqiData: AQIData = {
            city: record.city,
            state: record.state,
            station: record.station,
            parameter: record.pollutant_id,
            value: avgValue,
            minValue: minValue,
            maxValue: maxValue,
            unit: 'µg/m³',
            lastUpdated: formattedDate,
            latitude: record.latitude,
            longitude: record.longitude,
          };

          return aqiData;
        } catch (error) {
          console.error(`Error processing record for ${record.city || 'unknown city'}:`, error);
          return null;
        }
      })
      .filter((record): record is AQIData => record !== null);

    if (validRecords.length === 0) {
      const locationMsg = [
        filters.city && `city ${filters.city}`,
        filters.state && `state ${filters.state}`,
        filters.station && `station ${filters.station}`,
        filters.parameter && `pollutant ${filters.parameter}`,
      ]
        .filter(Boolean)
        .join(', ');
      throw new Error(
        `No valid AQI data available for ${locationMsg || 'the selected location'}. ` +
        'The monitoring station might be temporarily offline.'
      );
    }

    // Sort records by city and station for better organization
    return validRecords.sort((a, b) => {
      const cityCompare = a.city.localeCompare(b.city);
      if (cityCompare !== 0) return cityCompare;
      return a.station.localeCompare(b.station);
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch AQI data. Please try again later.'
      );
    }
    throw error;
  }
};