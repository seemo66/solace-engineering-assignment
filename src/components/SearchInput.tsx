'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// a type for the component's props
type SearchInputProps = {
  value: string;
};

// the search input component
export default function SearchInput({ value }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(value);

  // use a debounce to prevent an api call on every keystroke
  useEffect(() => {
    // wait 400ms after the user stops typing
    const timer = setTimeout(() => {
      // create a new url search params object from the current url
      const params = new URLSearchParams(searchParams.toString());

      // set or delete the 'search' parameter based on the input value
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }

      // update the url, which triggers a server-side re-render
      router.replace(`/?${params.toString()}`);
    }, 400);

    // clean up the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, [searchTerm, router, searchParams]);

  return (
    <div className="mb-6">
      <label htmlFor="search" className="block font-medium mb-2">
        search for an advocate
      </label>
      <input
        data-testid="search-input"
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="type name, city, specialty, or degree type."
        className="border rounded-lg p-2 w-full max-w-md shadow-sm"
      />
    </div>
  );
}
