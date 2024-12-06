import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AQICharts } from '../components/AQICharts';
import { INDIAN_CITIES } from '../utils/constants';
import { ArrowLeft } from 'lucide-react';

interface CityAQIProps {
  metaTitle?: string;
  metaDescription?: string;
}

export const CityAQI: React.FC<CityAQIProps> = ({ 
  metaTitle,
  metaDescription 
}) => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const city = INDIAN_CITIES.find(c => 
    c.value.toLowerCase() === cityName?.toLowerCase()
  );
  
  if (!city) {
    return <Navigate to="/" replace />;
  }

  const title = metaTitle || `${city.label} Air Quality Index (AQI) - Live Air Pollution Levels`;
  const description = metaDescription || `Monitor real-time Air Quality Index (AQI) in ${city.label}. Get detailed pollution data, health recommendations, and historical air quality trends for ${city.label}, India.`;

  return (
    <>
      <SEO 
        title={title}
        description={description}
        canonicalUrl={`/city/${cityName?.toLowerCase()}`}
        cityName={city.label}
      />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          aria-label="Return to home page"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        
        <h1 className="text-3xl font-bold mb-6">
          Air Quality Index in {city.label}
        </h1>
        <AQICharts initialCity={city.value} />
      </div>
    </>
  );
}; 