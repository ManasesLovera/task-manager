import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResolutionVelocity from './ResolutionVelocity';

describe('ResolutionVelocity', () => {
  it('renders correctly with data', () => {
    render(<ResolutionVelocity averageHours={10.5} />);
    expect(screen.getByText('Average Resolution Time')).toBeInTheDocument();
    expect(screen.getByText('10h 30m')).toBeInTheDocument();
  });

  it('renders correctly with less than one hour', () => {
    render(<ResolutionVelocity averageHours={0.5} />);
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
  });

  it('renders "No data" when averageHours is 0', () => {
    render(<ResolutionVelocity averageHours={0} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
