import { describe, it, expect, vi } from 'vitest';
import { createAgentWithAgency } from '@/lib/database';

// Mock Supabase
vi.mock('@/utils/supabase/server', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: '123' }, error: null })),
        })),
      })),
    })),
  }),
}));

describe('Database functions', () => {
  it('should create agent with agency', async () => {
    const agentData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      telephone: '1234567890',
      agency_name: 'Test Agency',
      agency_city: 'Test City',
      agency_country: 'Test Country',
      agency_zip_code: '12345',
      agency_email: 'agency@test.com',
      agency_telephone: '0987654321',
    };

    const result = await createAgentWithAgency(agentData);
    expect(result).toBeDefined();
  });
});
