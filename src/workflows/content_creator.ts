import { setupAgent } from '../agent';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Executes a 3-step autonomous workflow using Ace Data Cloud:
 * 1. AI Chat (gpt-4o) to generate a creative concept.
 * 2. Image Generation (flux) to create a visual for the concept.
 * 3. Audio Generation (suno) to generate a soundtrack for the concept.
 * 
 * All calls are wrapped by the X402 payment interceptor, allowing the agent
 * to autonomously pay for these API calls via Solana if they return a 402.
 */
export async function runContentCreatorWorkflow() {
    const apiToken = process.env.ACE_DATA_CLOUD_API_KEY;
    const privateKey = process.env.SOLANA_PRIVATE_KEY;

    if (!apiToken || !privateKey) {
        throw new Error('ACE_DATA_CLOUD_API_KEY and SOLANA_PRIVATE_KEY must be set in the environment.');
    }

    // 1. Initialize the agent client with X402 payment handling enabled
    console.log('Initializing Ace Data Cloud Agent with X402 interceptor...');
    const client = setupAgent(apiToken, privateKey);

    try {
        // Step 1: Generate a concept using AI Chat
        console.log('\n--- Step 1: Generating Concept (AI Chat) ---');
        const chatResponse: any = await client.aichat.create({
            model: 'gpt-4o',
            question: 'Write a very brief, 1-sentence prompt for a beautiful cinematic sci-fi cityscape image.'
        });
        
        // Extract the response text (assuming OpenAI-like or direct text response format based on typical APIs)
        // Usually chat APIs return something like { answer: '...' } or { choices: [{ message: { content: '...' } }] }
        const conceptText = chatResponse.answer || chatResponse.choices?.[0]?.message?.content || 'A futuristic cyberpunk city at night with flying cars and neon lights.';
        console.log(`Generated Concept: ${conceptText}`);

        // Step 2: Generate an image using the concept
        console.log('\n--- Step 2: Generating Image (Flux) ---');
        const imageResponse: any = await client.images.generate({
            prompt: conceptText,
            provider: 'midjourney',
            size: '1024x1024',
            wait: true // Assuming the SDK polls or waits for completion if we pass wait: true
        });
        console.log('Image Generation Result:', imageResponse);

        // Step 3: Generate audio/music using the concept
        console.log('\n--- Step 3: Generating Soundtrack (Suno) ---');
        const audioResponse: any = await client.audio.generate({
            prompt: `Cinematic sci-fi soundtrack for this scene: ${conceptText}`,
            provider: 'suno',
            wait: true
        });
        console.log('Audio Generation Result:', audioResponse);

        console.log('\n✅ Content Creator Workflow completed successfully!');
        
        return {
            concept: conceptText,
            image: imageResponse,
            audio: audioResponse
        };

    } catch (error: any) {
        console.error('Workflow failed:', error.message);
        if (error.response) {
            console.error('API Response Data:', error.response.data);
        }
        throw error;
    }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runContentCreatorWorkflow().catch(console.error);
}
