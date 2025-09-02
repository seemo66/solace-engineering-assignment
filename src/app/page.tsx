import AdvocateCard from '@/components/AdvocateCard';
import SearchInput from '@/components/SearchInput';
import type { Advocate } from '@/types/advocate';

// fetches advocates from the api based on a search term
async function getAdvocates(search: string): Promise<Advocate[] | null> {
  try {
    const res = await fetch(
      `http://localhost:3000/api/advocates?search=${encodeURIComponent(search)}`
    );
    // if the response is not successful, throw an error
    if (!res.ok) {
      throw new Error('failed to fetch advocates');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    // logs the api fetch error and returns null on failure
    console.error('api fetch error:', error);
    return null;
  }
}

// homepage component which is a server-side component by default
export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  // retrieves the search term from the url or uses an empty string if none exists
  const searchTerm = searchParams.search || '';
  const advocates = await getAdvocates(searchTerm);

  // if the api fetch fails (advocates is null), render an error message
  if (advocates === null) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">solace advocates</h1>
        <p className="text-red-500">
          sorry, we couldn&#39;t load the advocates at this time. please try
          again later.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">solace advocates</h1>
      {/* a client-side search input component that updates the url */}
      <SearchInput value={searchTerm} />
      {/* conditionally render a message or the list of advocates */}
      {advocates.length === 0 ? (
        <p className="text-gray-500">no advocates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advocates.map((advocate: Advocate) => (
            <AdvocateCard key={advocate.phoneNumber} advocate={advocate} />
          ))}
        </div>
      )}
    </main>
  );
}
