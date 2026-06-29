import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './Navbar';
import { useAuth } from '@/context/AuthContext';

// Mock the Auth Context
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the API services
vi.mock('@/api/services', () => ({
  productApi: {
    getAll: vi.fn(),
  },
}));

describe('Navbar Component', () => {
  const mockOnCartClick = vi.fn();
  const mockOnAuthClick = vi.fn();
  const mockOnMenuClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly for an unauthenticated user', () => {
    // Setup mock return value for unauthenticated state
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar 
          cartCount={0} 
          onCartClick={mockOnCartClick} 
          onAuthClick={mockOnAuthClick} 
          onMenuClick={mockOnMenuClick} 
        />
      </MemoryRouter>
    );

    // Should render the brand name
    expect(screen.getByText('PETAL & PEARL')).toBeInTheDocument();
  });

  it('displays the cart count badge when cart count is greater than 0', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar 
          cartCount={3} 
          onCartClick={mockOnCartClick} 
          onAuthClick={mockOnAuthClick} 
          onMenuClick={mockOnMenuClick} 
        />
      </MemoryRouter>
    );

    // The badge with number 3 should be visible
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows user name and logout button when authenticated', () => {
    // Setup mock return value for authenticated state
    (useAuth as any).mockReturnValue({
      user: { name: 'John Doe', role: 'user' },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar 
          cartCount={0} 
          onCartClick={mockOnCartClick} 
          onAuthClick={mockOnAuthClick} 
          onMenuClick={mockOnMenuClick} 
        />
      </MemoryRouter>
    );

    // User's name should be displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Logout button should be visible
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
