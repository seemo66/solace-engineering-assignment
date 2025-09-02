import { render, screen } from '@testing-library/react';
import type { Advocate } from '@/types/advocate';
// Mock the 'next/navigation' module since it's used in the Server Component and Client Components
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  notFound: jest.fn(),
}));

// Mock the global fetch function to control API responses
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the client components to simplify the test
jest.mock('@/components/AdvocateCard', () => {
  const MockAdvocateCard = ({ advocate }: { advocate: Advocate }) => (
    <div data-testid="advocate-card">
      {advocate.firstName} {advocate.lastName}
    </div>
  );
  MockAdvocateCard.displayName = 'MockAdvocateCard';
  return MockAdvocateCard;
});

jest.mock('@/components/SearchInput', () => {
  const MockSearchInput = () => <input data-testid="search-input" />;
  MockSearchInput.displayName = 'MockSearchInput';
  return MockSearchInput;
});

// Use require() to get the mocked Home component and getAdvocates function
const Home = require('./page').default;
const notFound = require('next/navigation').notFound;

describe('Home Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render the Solace Advocates heading and the search input', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });

    render(await Home({ searchParams: {} }));

    expect(
      screen.getByRole('heading', { name: /solace advocates/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render a list of advocates when data is fetched successfully', async () => {
    const mockAdvocates = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        city: 'New York',
        degree: 'MD',
        specialties: ['Cardiology'],
        yearsOfExperience: 10,
        phoneNumber: 1234567890,
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        city: 'Los Angeles',
        degree: 'PhD',
        specialties: ['Oncology'],
        yearsOfExperience: 15,
        phoneNumber: 9876543210,
      },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockAdvocates }),
    });

    render(await Home({ searchParams: {} }));

    const advocateCards = await screen.findAllByTestId('advocate-card');
    expect(advocateCards).toHaveLength(2);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display "No advocates found" when no advocates are returned from the search', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });

    render(await Home({ searchParams: { search: 'nonexistent' } }));

    expect(screen.getByText('No advocates found.')).toBeInTheDocument();
  });

  it('should call notFound() on a data fetch error', async () => {
    // Mock the console.error to prevent it from causing a test failure
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock a failed fetch call by returning an `ok: false` response
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await Home({ searchParams: {} });

    expect(notFound).toHaveBeenCalled();
  });
});
