import { describe, it, expect } from 'vitest';
import { AceDataCloud } from '@acedatacloud/sdk';
import { setupAgent } from '../src/agent';

describe('Autonomous Agent Setup', () => {
    it('should configure AceDataCloud client with an X402 payment handler', () => {
        // Mock API Key and Private Key
        const apiKey = 'test_api_key';
        const privateKey = 'test_private_key_base58_encoded_string';
        
        const client = setupAgent(apiKey, privateKey);
        
        expect(client).toBeInstanceOf(AceDataCloud);
        
        // Use any to bypass TS private field checking for test purposes
        expect((client as any).options?.paymentHandler ?? (client as any).transport?.paymentHandler ?? (client as any).paymentHandler).toBeDefined();
    });
});
