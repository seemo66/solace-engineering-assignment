import { NextResponse } from 'next/server';
import { advocateData } from '@/db/seed/advocates';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';

  const data = advocateData;

  const filteredAdvocates = searchTerm
    ? data.filter((advocate) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
          advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
          advocate.city.toLowerCase().includes(lowerSearchTerm) ||
          advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
          advocate.specialties.some((specialty) =>
            specialty.toLowerCase().includes(lowerSearchTerm)
          )
        );
      })
    : data;

  return NextResponse.json({
    data: filteredAdvocates,
  });
}
