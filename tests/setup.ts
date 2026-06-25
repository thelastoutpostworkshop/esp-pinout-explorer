import { config } from '@vue/test-utils';
import { vi } from 'vitest';

config.global.renderStubDefaultSlot = true;

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  value: ResizeObserverMock,
  writable: true,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: IntersectionObserverMock,
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});

if (!window.CSS) {
  Object.defineProperty(window, 'CSS', {
    value: {
      supports: () => false,
    },
    writable: true,
  });
}

if (!window.CSS.supports) {
  Object.defineProperty(window.CSS, 'supports', {
    value: () => false,
    writable: true,
  });
}
