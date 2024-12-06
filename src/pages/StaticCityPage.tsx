import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AQICharts } from '../components/AQICharts';
import { INDIAN_CITIES } from '../utils/constants';

export const StaticCityPage = () => {
  const { cityName } = useParams();
  const city = INDIAN_CITIES.find(c => 
    c.value.toLowerCase() === cityName?.toLowerCase()
  );

  if (!city) {
    return null;
  }

  const title = `${city.label} Air Quality Index (AQI) - Live Air Pollution Levels`;
  const description = `Monitor real-time Air Quality Index (AQI) in ${city.label}. Get detailed pollution data, health recommendations, and historical air quality trends for ${city.label}, India.`;
  const keywords = `${city.label} AQI, ${city.label} air quality, ${city.label} pollution levels, air quality index ${city.label}, pollution monitoring ${city.label}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={title}
        description={description}
        keywords={keywords}
        canonicalUrl={`/city/${cityName?.toLowerCase()}`}
        cityName={city.label}
      />
      
      <h1 className="text-3xl font-bold mb-6 text-center">
        Air Quality Index in {city.label}
      </h1>

      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 mb-4">
          Get real-time Air Quality Index (AQI) data for {city.label}. Monitor various pollutants including PM2.5, PM10, NO2, SO2, CO, and Ozone levels.
        </p>
        <p className="text-gray-600">
          Our monitoring stations across {city.label} provide up-to-date air quality measurements, helping you make informed decisions about outdoor activities and health precautions.
        </p>
      </div>

      <AQICharts initialCity={city.value} />

      <div className="mt-8 prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">Understanding {city.label}'s Air Quality</h2>
        <p>
          The Air Quality Index (AQI) in {city.label} is calculated based on the concentration of various pollutants in the air. These include:
        </p>
        <ul>
          <li><strong>PM2.5 and PM10:</strong> Fine particulate matter that can penetrate deep into the lungs</li>
          <li><strong>NO2:</strong> Nitrogen dioxide from vehicle emissions and industrial processes</li>
          <li><strong>SO2:</strong> Sulfur dioxide from industrial activities</li>
          <li><strong>CO:</strong> Carbon monoxide from incomplete combustion</li>
          <li><strong>O3:</strong> Ground-level ozone formed by chemical reactions between pollutants</li>
        </ul>
      </div>
    </div>
  );
};
