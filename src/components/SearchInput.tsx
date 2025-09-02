'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type SearchInputProps = {
  value: string;
};

export default function SearchInput({ value }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(searchParams);

      if (searchTerm) {
        current.set('search', searchTerm);
      } else {
        current.delete('search');
      }

      router.push(`/?${current.toString()}`);
    }, 400); // Debounce for 400ms

    return () => clearTimeout(timer);
  }, [searchTerm, router, searchParams]);

  return (
    <div className="mb-6">
      <label htmlFor="search" className="block font-medium mb-2">
        Search for an advocate
      </label>
      <input
        data-testid="search-input"
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type name, city, specialty or degree type."
        className="border rounded-lg p-2 w-full max-w-md shadow-sm"
      />
    </div>
  );
}
