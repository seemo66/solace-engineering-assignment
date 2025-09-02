import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render the footer element', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should display the correct copyright notice', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(
      /© 2025 Find Solace, Inc. All rights reserved./i
    );
    expect(copyrightText).toBeInTheDocument();
  });

  it('should contain links for Terms of Service and Privacy Policy', () => {
    render(<Footer />);
    const termsLink = screen.getByRole('link', { name: /terms of service/i });
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    expect(termsLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
  });
});
