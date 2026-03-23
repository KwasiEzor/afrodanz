import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventsPreview, type EventPreviewItem } from './EventsPreview';
import { bookEvent } from '@/app/actions/bookings';
import { toast } from 'sonner';

const routerPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPush,
  }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function createMotionComponent(tag: 'div' | 'button') {
  const MotionComponent = (componentProps: Record<string, unknown> & { children?: React.ReactNode }) => {
    const { children, ...props } = componentProps;

    delete props.initial;
    delete props.animate;
    delete props.exit;
    delete props.whileHover;
    delete props.whileTap;
    delete props.transition;
    delete props.viewport;
    delete props.layout;

    return React.createElement(tag, props, children);
  };

  MotionComponent.displayName = `MockMotion${tag.toUpperCase()}`;

  return MotionComponent;
}

vi.mock('framer-motion', () => ({
  motion: {
    div: createMotionComponent('div'),
    button: createMotionComponent('button'),
  },
}));

vi.mock('@/app/actions/bookings', () => ({
  bookEvent: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

const sampleEvents: EventPreviewItem[] = [
  {
    id: 'evt_1',
    slug: 'amapiano-night',
    title: 'Amapiano Night',
    date: '2026-04-05T18:00:00.000Z',
    location: 'Main Studio',
    price: 2500,
    category: 'Workshop',
  },
];

describe('EventsPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders provided events and books using the real event id', async () => {
    vi.mocked(bookEvent).mockResolvedValue({ success: true });

    render(<EventsPreview events={sampleEvents} />);

    expect(screen.getByText('Amapiano Night')).toBeInTheDocument();
    expect(screen.getByText('€25.00')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Join Event' }));

    await waitFor(() => {
      expect(bookEvent).toHaveBeenCalledWith('evt_1');
      expect(routerPush).toHaveBeenCalledWith('/dashboard?booking_success=true');
    });
  });

  it('redirects unauthenticated users to login with a toast', async () => {
    vi.mocked(bookEvent).mockRejectedValue(new Error('You must be logged in to book an event'));

    render(<EventsPreview events={sampleEvents} />);

    fireEvent.click(screen.getByRole('button', { name: 'Join Event' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please log in to secure your spot.');
      expect(routerPush).toHaveBeenCalledWith('/login');
    });
  });
});
