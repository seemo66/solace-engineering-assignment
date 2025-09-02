import AdvocateCard from '@/components/AdvocateCard';
import SearchInput from '@/components/SearchInput';
import { notFound } from 'next/navigation';

async function getAdvocates(search: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/advocates?search=${encodeURIComponent(search)}`
    );
    if (!res.ok) {
      throw new Error('Failed to fetch advocates');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchTerm = searchParams.search || '';
  const advocates = await getAdvocates(searchTerm);

  if (advocates === null) {
    return notFound();
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Solace Advocates</h1>

      <SearchInput value={searchTerm} />

      {advocates.length === 0 ? (
        <p className="text-gray-500">No advocates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advocates.map((advocate: any) => (
            <AdvocateCard key={advocate.id} advocate={advocate} />
          ))}
        </div>
      )}
    </main>
  );
}
