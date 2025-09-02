import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '@/components/SearchInput';
import { useRouter, useSearchParams } from 'next/navigation';

// mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('SearchInput Component', () => {
  // use fake timers to control the debounce timeout
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the input with the correct initial value', () => {
    // arrange: mock the search params and router
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (useRouter as jest.Mock).mockReturnValue({ replace: jest.fn() });

    // act: render the component with an initial value
    render(<SearchInput value="test value" />);

    // assert: check if the input element has the correct value
    expect(screen.getByTestId('search-input')).toHaveValue('test value');
  });

  it('should update the URL after a debounce period when typing', () => {
    // arrange: mock the router and search params
    const mockRouterReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    // act: render the component and simulate a user typing
    render(<SearchInput value="" />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'new search' } });

    // assert: ensure router.replace is not called immediately
    expect(mockRouterReplace).not.toHaveBeenCalled();

    // act: advance the timers by 400ms (the debounce time)
    jest.advanceTimersByTime(400);

    // assert: now, ensure router.replace was called with the correct url
    expect(mockRouterReplace).toHaveBeenCalledWith('/?search=new+search');
  });

  it('should remove the search param from the URL when the input is cleared', () => {
    // arrange: mock the router and search params
    const mockRouterReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace });
    const initialParams = new URLSearchParams('search=existing+value');
    (useSearchParams as jest.Mock).mockReturnValue(initialParams);

    // act: render the component and simulate clearing the input
    render(<SearchInput value="existing value" />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: '' } });

    // act: advance the timers to trigger the debounce
    jest.advanceTimersByTime(400);

    // assert: ensure router.replace was called with the url that has the search param removed
    expect(mockRouterReplace).toHaveBeenCalledWith('/?');
  });
});
