import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Using GDELT GEO 2.0 API to get geographic point data for recent events mentioning Africa
    const url = `https://api.gdeltproject.org/api/v2/geo/geo?query=Africa&mode=PointData&format=json`;
    
    const response = await fetch(url, { next: { revalidate: 900 } }); // Cache for 15 minutes
    
    if (!response.ok) {
      throw new Error(`GDELT API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // GDELT PointData returns an array of features
    const features = data.features || [];
    
    // Transform into a format easy for react-globe.gl to consume
    const newsPoints = features.map((feature: any) => ({
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      name: feature.properties.name,
      url: feature.properties.url,
      domain: feature.properties.domain,
      html: feature.properties.html
    }));

    return NextResponse.json(newsPoints);
  } catch (error) {
    console.error('News fetch error:', error);
    // Return empty array as fallback so globe doesn't crash
    return NextResponse.json([]);
  }
}
