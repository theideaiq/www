import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateResponse } from './gemini';

// Hoist mocks
const { mockStartChat, mockSendMessage } = vi.hoisted(() => ({
  mockStartChat: vi.fn(),
  mockSendMessage: vi.fn(),
}));

// Mock env
vi.mock('../env', () => ({
  env: {
    GEMINI_API_KEY: 'mock-key',
  },
}));

// Mock Supabase
const mockSelect = vi.fn();
const mockIlike = vi.fn();
const mockLimit = vi.fn();

vi.mock('./supabase', () => ({
  supabase: {
    from: () => ({
      select: mockSelect.mockReturnValue({
        ilike: mockIlike.mockReturnValue({
          limit: mockLimit,
        }),
      }),
    }),
  },
}));

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          startChat: mockStartChat,
        };
      }
    },
    SchemaType: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
    },
  };
});

describe('generateResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStartChat.mockReturnValue({
      sendMessage: mockSendMessage,
    });
    // Default mocks to avoid errors
    mockSelect.mockReturnValue({
      ilike: mockIlike,
    });
    mockIlike.mockReturnValue({
      limit: mockLimit,
    });
  });

  it('handles simple text response', async () => {
    mockSendMessage.mockResolvedValue({
      response: {
        text: () => 'Hello user',
        functionCalls: () => [],
      },
    });

    const response = await generateResponse([], 'Hi');
    expect(response).toBe('Hello user');
  });

  it('handles function call search_products', async () => {
    // First response triggers function call
    mockSendMessage.mockResolvedValueOnce({
      response: {
        functionCalls: () => [
          {
            name: 'search_products',
            args: { query: 'ps5' },
          },
        ],
      },
    });

    // Mock DB response
    mockLimit.mockResolvedValue({
      data: [{ id: 1, name: 'PS5', price: 500 }],
      error: null,
    });

    // Second response (after function)
    mockSendMessage.mockResolvedValueOnce({
      response: {
        text: () => 'Here is the PS5',
        functionCalls: () => [],
      },
    });

    const response = await generateResponse([], 'Find PS5');

    expect(mockIlike).toHaveBeenCalledWith('name', '%ps5%');
    expect(response).toBe('Here is the PS5');
  });
});
