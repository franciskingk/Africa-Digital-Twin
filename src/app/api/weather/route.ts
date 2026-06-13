import { NextResponse } from 'next/server';

// African capital/major cities coordinates
const CITIES = [
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219, country: 'Kenya' },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: 'South Africa' },
  { name: 'Addis Ababa', lat: 9.0320, lng: 38.7480, country: 'Ethiopia' },
  { name: 'Kinshasa', lat: -4.4419, lng: 15.2663, country: 'DRC' },
  { name: 'Dar es Salaam', lat: -6.7924, lng: 39.2083, country: 'Tanzania' },
  { name: 'Accra', lat: 5.6037, lng: -0.1870, country: 'Ghana' },
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898, country: 'Morocco' },
  { name: 'Luanda', lat: -8.8390, lng: 13.2894, country: 'Angola' },
];

export async function GET() {
  try {
    const latParams = CITIES.map(c => c.lat).join(',');
    const lngParams = CITIES.map(c => c.lng).join(',');
    
    // Fetch weather from Open-Meteo for all cities at once
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latParams}&longitude=${lngParams}&current=temperature_2m,precipitation,weather_code&timezone=auto`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Transform Open-Meteo multi-location response back to city objects
    const results = CITIES.map((city, i) => {
      // the api returns array of responses when multiple coordinates are passed
      const cityData = Array.isArray(data) ? data[i] : data;
      
      return {
        ...city,
        temp: cityData?.current?.temperature_2m || 0,
        precip: cityData?.current?.precipitation || 0,
        code: cityData?.current?.weather_code || 0
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
