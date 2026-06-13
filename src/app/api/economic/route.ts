import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Top African economies by GDP
    const countries = 'NGA;EGY;ZAF;DZA;MAR;ETH;KEN;AGO;TZA;CIV;GHA';
    const url = `https://api.worldbank.org/v2/country/${countries}/indicator/NY.GDP.MKTP.CD?date=2022&format=json`;
    
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 1 day
    
    if (!response.ok) {
      throw new Error(`World Bank API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length < 2) {
      return NextResponse.json([]);
    }
    
    // World Bank returns [{page info}, [actual data points]]
    const records = data[1] || [];
    
    const gdpData = records.map((record: any) => ({
      countryId: record.country.id,
      countryName: record.country.value,
      gdp: record.value,
      year: record.date
    })).filter((r: any) => r.gdp !== null);

    return NextResponse.json(gdpData);
  } catch (error) {
    console.error('Economic fetch error:', error);
    return NextResponse.json([]);
  }
}
