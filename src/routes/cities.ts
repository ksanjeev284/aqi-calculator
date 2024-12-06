import { INDIAN_CITIES } from '../utils/constants';

export const cityRoutes = INDIAN_CITIES.map(city => ({
  path: `/city/${city.value.toLowerCase()}`,
  cityName: city.label,
  metaTitle: `${city.label} Air Quality Index (AQI) - Live Air Pollution Data`,
  metaDescription: `Monitor real-time Air Quality Index (AQI) in ${city.label}. Get detailed pollution data, health recommendations, and historical air quality trends for ${city.label}, India.`
})); 