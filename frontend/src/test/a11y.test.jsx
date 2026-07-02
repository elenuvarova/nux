import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Home from '../pages/Home.jsx';
import Browse from '../pages/Browse.jsx';
import { CuratorProvider } from '../lib/useCurator.jsx';

vi.mock('../lib/api.js', () => ({ api: { get: vi.fn(), post: vi.fn(), del: vi.fn() } }));
import { api } from '../lib/api.js';

expect.extend(toHaveNoViolations);

// jsdom can't compute rendered colors, so axe's contrast check is unreliable
// here — contrast is verified separately, from the token pairs.
const AXE_CONFIG = { rules: { 'color-contrast': { enabled: false } } };

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  api.get.mockResolvedValue({ collections: [] });
});

describe('automated a11y gate (axe)', () => {
  it('Home renders with no axe violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    // let the mocked /collections fetch resolve so skeletons swap out
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/collections'));
    const results = await axe(container, AXE_CONFIG);
    expect(results).toHaveNoViolations();
  });

  it('Browse renders with no axe violations', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/browse']}>
        <CuratorProvider>
          <Browse />
        </CuratorProvider>
      </MemoryRouter>
    );
    const results = await axe(container, AXE_CONFIG);
    expect(results).toHaveNoViolations();
  });
});
