import { describe, it, expect, vi } from 'vitest';
import { registerOnSap } from '../src/sap-agent';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

vi.mock('@oobe-protocol-labs/synapse-sap-sdk', () => {
    return {
        createSapClient: vi.fn().mockReturnValue({
            agent: {
                register: vi.fn().mockResolvedValue('mocked_tx_object')
            },
            sendTransaction: vi.fn().mockResolvedValue('mocked_transaction_signature')
        })
    };
});

describe('SAP Agent Registration', () => {
    it('should initialize SAP client and register the agent on-chain', async () => {
        // Generate a random keypair for testing
        const keypair = Keypair.generate();
        const privateKeyStr = bs58.encode(keypair.secretKey);
        const rpcUrl = 'https://api.devnet.solana.com';

        // We expect registerOnSap to return the transaction signature
        const txSig = await registerOnSap(privateKeyStr, rpcUrl);

        expect(txSig).toBeDefined();
        expect(typeof txSig).toBe('string');
        expect(txSig).toBe('mocked_transaction_signature');
    });
});
