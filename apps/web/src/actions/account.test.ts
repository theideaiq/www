// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateProfile } from './account';

// Mock Supabase
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: () => ({
      update: mockUpdate.mockReturnValue({
        eq: mockEq,
      }),
    }),
  }),
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock env if needed (account.ts doesn't use it directly but creates client might)
// But since we mock createClient entirely, it's fine.

describe('updateProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEq.mockResolvedValue({ error: null });
    // Setup chain
    mockUpdate.mockReturnValue({ eq: mockEq });
  });

  it('updates profile successfully', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });

    const formData = new FormData();
    formData.append('fullName', 'John Doe');

    await updateProfile(formData);

    expect(mockUpdate).toHaveBeenCalledWith({ full_name: 'John Doe' });
    expect(mockEq).toHaveBeenCalledWith('id', 'user-1');
  });

  it('throws if not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const formData = new FormData();
    formData.append('fullName', 'John Doe');

    await expect(updateProfile(formData)).rejects.toThrow('Not authenticated');
  });
});
