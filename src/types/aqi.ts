export interface AQIData {
  city: string;
  state: string;
  station: string;
  parameter: string;
  value: number;
  minValue: number;
  maxValue: number;
  unit: string;
  lastUpdated: string;
  latitude?: string;
  longitude?: string;
}

export interface CityOption {
  label: string;
  value: string;
}

export interface AQIFilters {
  state?: string;
  city?: string;
  station?: string;
  parameter?: string;
}

export interface APIRecord {
  country: string;
  state: string;
  city: string;
  station: string;
  last_update: string;
  latitude: string;
  longitude: string;
  pollutant_id: string;
  min_value: string;
  max_value: string;
  avg_value: string;
}

export interface APIResponse {
  records: APIRecord[];
  total: number;
  count: number;
  limit: number;
  offset: number;
}

export const STATES = [
  'Andhra_Pradesh',
  'Arunachal_Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Himachal_Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya_Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil_Nadu',
  'Telangana',
  'Tripura',
  'Uttar_Pradesh',
  'Uttarakhand',
  'West_Bengal'
] as const;

export const POLLUTANTS = ['OZONE', 'CO', 'SO2', 'NO2'] as const;

export type State = typeof STATES[number];
export type Pollutant = typeof POLLUTANTS[number];