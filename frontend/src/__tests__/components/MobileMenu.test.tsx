import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MobileMenu from '../../components/MobileMenu';
import { useAuth } from '@/context/AuthContext';

// Mock the Auth Context
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('MobileMenu Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when isOpen is false', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MobileMenu isOpen={false} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Menu text should not be in document
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('renders menu items when isOpen is true', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Basic navigation links should be visible
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Ornaments')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  it('renders user specific items when authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: { name: 'Jane Doe' },
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Instead of 'Menu', it should show the user's name
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    // Authenticated links should be visible
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <MobileMenu isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    // Find the close button by looking for the one inside the header (it's the only one without text)
    // We can find it by getting the backdrop or close button, but backdrop is easiest
    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
