import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { AQI_LEVELS } from '../utils/constants';
import { Wind, Droplets, ArrowUp, ArrowDown } from 'lucide-react';
import { AQIData } from '../types/aqi';

interface AQICardProps {
  data: AQIData;
  onClick?: (city: string) => void;
}

export const AQICard: React.FC<AQICardProps> = ({ data, onClick }) => {
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

  const handleClick = () => {
    if (onClick) {
      onClick(data.city);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View charts for ${data.city}`}
    >
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <ArrowDown className="w-4 h-4 text-blue-500 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Min</div>
            <div className="font-semibold">{formattedMin}</div>
          </div>
        </div>
        <div className="flex items-center">
          <ArrowUp className="w-4 h-4 text-red-500 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Max</div>
            <div className="font-semibold">{formattedMax}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Wind className="w-4 h-4 mr-1" />
          <span>{data.state}</span>
        </div>
        <div className="flex items-center">
          <Droplets className="w-4 h-4 mr-1" />
          <span>{!isDateError ? formatLastUpdated(data.lastUpdated) : 'Time unavailable'}</span>
        </div>
      </div>
    </div>
  );
};