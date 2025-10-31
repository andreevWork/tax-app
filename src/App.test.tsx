import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App component', () => {
  it('renders heading correctly', () => {
    render(<App />);

    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
  });
});
