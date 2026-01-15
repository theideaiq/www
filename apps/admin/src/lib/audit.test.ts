import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logAdminAction } from './audit';
import * as SupabaseServer from '@/lib/supabase/server';

// Mock the module
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('logAdminAction', () => {
  let mockSupabase: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup default happy path mock for Supabase
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    };

    (SupabaseServer.createClient as any).mockResolvedValue(mockSupabase);

    // Spy on console
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log action when user exists', async () => {
    const action = 'test_action';
    const resource = 'test_resource';
    const details = { foo: 'bar' };

    await logAdminAction(action, resource, details);

    expect(SupabaseServer.createClient).toHaveBeenCalled();
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs');
    expect(mockSupabase.from('audit_logs').insert).toHaveBeenCalledWith({
      admin_id: 'test-user-id',
      action,
      target_resource: resource,
      details,
    });
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should warn and skip insert if no user found', async () => {
    // Override mock to return no user
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    await logAdminAction('action', 'resource');

    expect(mockSupabase.from).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      'Attempted to log admin action without user context',
      { action: 'action', resource: 'resource' }
    );
  });

  it('should log error if insert fails', async () => {
    const error = { message: 'DB Error' };
    mockSupabase.from().insert.mockResolvedValue({ error });

    await logAdminAction('action', 'resource');

    expect(console.error).toHaveBeenCalledWith('Failed to write audit log:', error);
  });

  it('should log error if exception occurs', async () => {
    const error = new Error('Unexpected');
    (SupabaseServer.createClient as any).mockRejectedValue(error);

    await logAdminAction('action', 'resource');

    expect(console.error).toHaveBeenCalledWith('Error in logAdminAction:', error);
  });
});
