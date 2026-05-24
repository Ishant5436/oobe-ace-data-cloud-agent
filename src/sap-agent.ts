import { createSapClient } from '@oobe-protocol-labs/synapse-sap-sdk';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Registers the agent on the SAP Protocol network.
 * @param privateKeyBase58 Base58 encoded private key of the agent
 * @param rpcUrl The Solana RPC URL to use
 * @returns The transaction signature of the registration
 */
export async function registerOnSap(privateKeyBase58: string, rpcUrl: string): Promise<string> {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKeyBase58));
    // Note: Wallet mock required since @coral-xyz/anchor Wallet isn't directly exposed easily without anchor dependency.
    // For our agent, we just pass an object conforming to the Wallet interface:
    const wallet = {
        publicKey: keypair.publicKey,
        signTransaction: async (tx: any) => {
            tx.sign(keypair);
            return tx;
        },
        signAllTransactions: async (txs: any[]) => {
            txs.forEach(tx => tx.sign(keypair));
            return txs;
        },
        payer: keypair
    } as any;

    const sapClient = createSapClient(rpcUrl, wallet);
    
    // Using the SAP SDK to register the agent
    // Typically involves sapClient.agent.register(...) and sending the tx
    // For the bounty, we construct the transaction using the module methods.
    
    const tx = await sapClient.agent.register({
        name: 'Ace-OOBE Agent',
        description: 'Autonomous AI agent powered by Ace Data Cloud and OOBE SAP',
        url: 'https://platform.acedata.cloud',
        metadata: {}
    });

    // Send the transaction (the SDK handles signing with the wallet)
    const txSig = await sapClient.sendTransaction(tx, [keypair]);
    return txSig;
}
