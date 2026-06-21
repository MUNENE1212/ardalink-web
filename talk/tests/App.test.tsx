import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the Talk heading', () => {
    render(<App />);
    expect(screen.getByText(/ArdaLink Talk/i)).toBeTruthy();
  });
});