import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { AQI_LEVELS } from '../utils/constants';
import { Wind, Droplets, ArrowUp, ArrowDown } from 'lucide-react';
import { AQIData } from '../types/aqi';

interface AQICardProps {
  data: AQIData;
}

export const AQICard: React.FC<AQICardProps> = ({ data }) => {
  const [isDateError, setIsDateError] = useState(false);

  const getAQILevel = (value: number) => {
    if (isNaN(value)) return AQI_LEVELS[0];
    return AQI_LEVELS.find(level => value >= level.range[0] && value <= level.range[1]) || AQI_LEVELS[0];
  };

  const formatLastUpdated = (isoDateStr: string) => {
    try {
      const date = parseISO(isoDateStr);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', isoDateStr, error);
      setIsDateError(true);
      return 'Time unavailable';
    }
  };

  const value = Number(data.value);
  const aqiLevel = getAQILevel(value);
  const formattedValue = isNaN(value) ? 'N/A' : Math.round(value).toString();
  const formattedMin = isNaN(data.minValue) ? 'N/A' : Math.round(data.minValue).toString();
  const formattedMax = isNaN(data.maxValue) ? 'N/A' : Math.round(data.maxValue).toString();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{data.city}</h2>
          <p className="text-sm text-gray-600">{data.station}</p>
        </div>
        <span className={`px-4 py-1 rounded-full text-white ${aqiLevel.color}`}>
          {aqiLevel.label}
        </span>
      </div>
      
      <div className="flex items-center justify-center my-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800">{formattedValue}</div>
          <div className="text-gray-500 mt-2">{data.parameter}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center">
          <ArrowDown className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Min Value</div>
            <div className="font-medium">{formattedMin} {data.unit}</div>
          </div>
        </div>
        <div className="flex items-center">
          <ArrowUp className="w-5 h-5 text-red-500 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Max Value</div>
            <div className="font-medium">{formattedMax} {data.unit}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Last updated {formatLastUpdated(data.lastUpdated)}
        {isDateError && (
          <div className="text-xs text-red-500 mt-1">
            Unable to determine exact update time
          </div>
        )}
      </div>
    </div>
  );
};