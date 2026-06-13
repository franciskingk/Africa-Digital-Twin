import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // OpenSky Network API - bounding box covering most of Africa
    const url = `https://opensky-network.org/api/states/all?lamin=-35&lomin=-20&lamax=37&lomax=52`;
    
    // Note: Anonymous access is limited to 100 requests per day.
    // For a real app, you'd use authentication. We'll cache aggressively to avoid hitting limits.
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 1 min
    
    if (!response.ok) {
      throw new Error(`OpenSky API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform state vectors to objects
    // State vector indices: 0:icao24, 1:callsign, 2:origin_country, 5:longitude, 6:latitude, 7:baro_altitude, 9:velocity, 10:true_track
    const flights = (data.states || []).map((state: any[]) => ({
      icao24: state[0],
      callsign: state[1]?.trim() || 'Unknown',
      country: state[2],
      lng: state[5],
      lat: state[6],
      altitude: state[7],
      velocity: state[9],
      heading: state[10]
    })).filter((f: any) => f.lat !== null && f.lng !== null);

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Flights fetch error:', error);
    return NextResponse.json([]);
  }
}
