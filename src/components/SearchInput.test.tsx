import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchInput from './SearchInput';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the Next.js router and searchParams hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('SearchInput', () => {
  let mockRouter: any;
  let mockSearchParams: any;

  // Use fake timers to control the debounce timeout
  beforeEach(() => {
    jest.useFakeTimers();
    mockRouter = { push: jest.fn() };
    mockSearchParams = new URLSearchParams();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render the label and input field with the correct placeholder', () => {
    render(<SearchInput value="" />);

    expect(
      screen.getByLabelText(/search for an advocate/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/type name, city, specialty or degree type./i)
    ).toBeInTheDocument();
  });

  it('should initialize the input with the provided value prop', () => {
    const initialValue = 'Dr. Smith';
    render(<SearchInput value={initialValue} />);

    expect(screen.getByDisplayValue(initialValue)).toBeInTheDocument();
  });

  it('should debounce and push the updated URL after a delay', async () => {
    const initialValue = '';
    const typedValue = 'John Doe';
    render(<SearchInput value={initialValue} />);

    const input = screen.getByLabelText(/search for an advocate/i);

    fireEvent.change(input, { target: { value: typedValue } });

    // Timer has not run yet, so push should not have been called
    expect(mockRouter.push).not.toHaveBeenCalled();

    // Fast-forward time past the debounce delay
    jest.advanceTimersByTime(400);

    // Wait for the push to be called with the correct URL
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith('/?search=John+Doe');
    });
  });

  it('should remove the search parameter when the input is cleared', async () => {
    const initialValue = 'John Doe';
    mockSearchParams.set('search', initialValue);

    render(<SearchInput value={initialValue} />);

    const input = screen.getByDisplayValue(initialValue);

    fireEvent.change(input, { target: { value: '' } });

    // Fast-forward time past the debounce delay
    jest.advanceTimersByTime(400);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith('/?');
    });
  });
});
