import { setupAgent } from './src/agent';
import * as dotenv from 'dotenv';
dotenv.config();

async function testImages() {
    const client = setupAgent(process.env.ACE_DATA_CLOUD_API_KEY!, process.env.SOLANA_PRIVATE_KEY!);
    console.log('Testing seedream...');
    try {
        const res = await client.images.generate({
            prompt: 'Test',
            provider: 'seedream',
            wait: false
        });
        console.log('Success:', res);
    } catch (e: any) {
        console.error('Error:', e.message);
    }
    process.exit(0);
}
testImages();
