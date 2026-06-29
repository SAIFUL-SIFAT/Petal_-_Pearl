import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Chatbot from './Chatbot';

// Mock useLocation
const mockLocation = { pathname: '/' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

// Polyfill for scrollIntoView since it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    localStorage.clear();
  });
  
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('renders chat button initially when closed', () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    );
    
    // The main floating button should be present
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('opens chat window when button is clicked', () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Check if the chat window header text appears
    expect(screen.getByText('Customer Support')).toBeInTheDocument();
  });

  it('handles quick replies correctly', () => {
    render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    );
    
    // Open chatbot
    fireEvent.click(screen.getByRole('button'));
    
    // Click on a quick reply
    const sizeGuideButton = screen.getByRole('button', { name: 'Size Guide' });
    fireEvent.click(sizeGuideButton);
    
    // Advance timers to trigger bot response
    act(() => {
      vi.advanceTimersByTime(600);
    });
    
    // Check if bot responded with size guide info
    expect(screen.getByText(/We follow standard size charts/i)).toBeInTheDocument();
  });

  it('does not render if user is admin based on localStorage', () => {
    localStorage.setItem('userType', 'admin');
    
    const { container } = render(
      <MemoryRouter>
        <Chatbot />
      </MemoryRouter>
    );
    
    // It should render completely null
    expect(container).toBeEmptyDOMElement();
  });
});
