import { render, screen } from '@testing-library/react';
import AdvocateCard from './AdvocateCard';
import type { Advocate } from '@/types/advocate';

const advocate: Advocate = {
  firstName: 'John',
  lastName: 'Doe',
  city: 'New York',
  degree: 'MD',
  specialties: ['Anxiety', 'Depression'],
  yearsOfExperience: 10,
  phoneNumber: 5551234567,
};

describe('AdvocateCard', () => {
  it('renders advocate info correctly', () => {
    render(<AdvocateCard advocate={advocate} />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/New York \| MD/i)).toBeInTheDocument();
    expect(screen.getByText(/Years of Experience: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone: 5551234567/i)).toBeInTheDocument();
    expect(screen.getByText(/Anxiety/i)).toBeInTheDocument();
    expect(screen.getByText(/Depression/i)).toBeInTheDocument();
  });
});
