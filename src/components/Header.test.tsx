import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render the header element', () => {
    render(<Header />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  it('should display the "Solace Health" text', () => {
    render(<Header />);
    const headingElement = screen.getByRole('heading', {
      level: 1,
      name: /solace health/i,
    });
    expect(headingElement).toBeInTheDocument();
  });
});
