import { NextResponse } from 'next/server';
import { db } from '@/db';
import { advocates } from '@/db/schema';
import { or, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('search') || '';
  const lowerSearchTerm = `%${searchTerm.toLowerCase()}%`;

  try {
    const filteredAdvocates = await db
      .select()
      .from(advocates)
      .where(
        searchTerm
          ? or(
              // search on string columns using a case-insensitive LIKE
              sql`LOWER(${advocates.firstName}) LIKE ${lowerSearchTerm}`,
              sql`LOWER(${advocates.lastName}) LIKE ${lowerSearchTerm}`,
              // search for a concatenated full name
              sql`LOWER(CONCAT(${advocates.firstName}, ' ', ${advocates.lastName})) LIKE ${lowerSearchTerm}`,
              sql`LOWER(${advocates.city}) LIKE ${lowerSearchTerm}`,
              sql`LOWER(${advocates.degree}) LIKE ${lowerSearchTerm}`,
              // search within the jsonb 'specialties' array using raw sql
              sql`LOWER(CAST(${advocates.specialties} AS TEXT)) LIKE ${lowerSearchTerm}`
            )
          : undefined
      );

    return NextResponse.json({
      data: filteredAdvocates,
    });
  } catch (error) {
    console.error('database query error:', error);
    return NextResponse.json(
      { error: 'failed to fetch advocates' },
      { status: 500 }
    );
  }
}
