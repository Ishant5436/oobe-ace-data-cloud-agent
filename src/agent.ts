import { AceDataCloud } from '@acedatacloud/sdk';
import { createX402PaymentHandler } from '@acedatacloud/x402-client';

/**
 * Initializes the autonomous agent with AceDataCloud and x402 payment support.
 * @param apiToken The Ace Data Cloud API Key
 * @param solanaPrivateKey The private key for the Solana wallet to pay x402
 * @returns An instance of the configured AceDataCloud
 */
export function setupAgent(apiToken: string, solanaPrivateKey: string): AceDataCloud {
    // 1. Initialize the x402 payment handler with the wallet
    const paymentHandler = createX402PaymentHandler({
        solanaPrivateKey,
        // Accept requests up to 0.5 USDC automatically
        maxAutoPaymentAmount: 0.5 
    });

    // 2. Attach the handler to the primary AceDataCloud SDK Client
    const client = new AceDataCloud({
        apiToken,
        paymentHandler
    });

    return client;
}
