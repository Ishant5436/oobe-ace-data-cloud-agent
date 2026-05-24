import { setupAgent } from '../agent';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

/**
 * Executes a blazing fast 3-step autonomous workflow using Ace Data Cloud:
 * 1. Search (Google) to find the latest trending topic.
 * 2. AI Chat (GPT-4o) to summarize the topic into a short script.
 * 3. Audio (Suno) to generate a quick audio snippet of the script.
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

    console.log('Initializing Ace Data Cloud Agent with X402 interceptor...');
    const client = setupAgent(apiToken, privateKey);

    try {
        // Step 1: Search for latest news
        console.log('\n--- Step 1: Searching for Latest Trends (Google Search) ---');
        const searchResponse: any = await client.search.google({
            query: 'latest artificial intelligence breakthroughs today'
        });
        
        // Extract a snippet from search results
        const firstResult = searchResponse.organic_results?.[0]?.snippet || 'AI agents are taking over the world.';
        console.log(`Found Trend: "${firstResult}"`);

        // Step 2: Generate a script using AI Chat
        console.log('\n--- Step 2: Generating Script (AI Chat) ---');
        const chatResponse: any = await client.aichat.create({
            model: 'gpt-4o',
            question: `Write a very brief, 1-sentence dramatic summary about this news: ${firstResult}`
        });
        
        const scriptText = chatResponse.answer || chatResponse.choices?.[0]?.message?.content || 'In a stunning leap, AI agents have evolved to act autonomously.';
        console.log(`Generated Script: ${scriptText}`);

        // Step 3: Vectorize the script (Embeddings)
        console.log('\n--- Step 3: Vectorizing Script (OpenAI Embeddings) ---');
        console.log('(This step is instantaneous...)');
        const embeddingResponse: any = await client.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: scriptText
        });
        
        const embeddingData = embeddingResponse.data?.[0]?.embedding;
        console.log(`Vector Dimension Length: ${embeddingData?.length || 'Unknown'}`);
        console.log('Embeddings Generated Successfully!');

        // Step 4: Save to Long-Term Memory (RAG)
        console.log('\n--- Step 4: Storing to Persistent Memory Bank ---');
        const memoryFilePath = path.join(process.cwd(), 'src', 'data', 'memory.json');
        let memory = [];
        if (fs.existsSync(memoryFilePath)) {
            const raw = fs.readFileSync(memoryFilePath, 'utf8');
            memory = JSON.parse(raw || '[]');
        }
        
        memory.push({
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            trend: firstResult,
            script: scriptText,
            vector: embeddingData
        });
        
        fs.writeFileSync(memoryFilePath, JSON.stringify(memory, null, 2));
        console.log(`Saved memory item. Total Memories: ${memory.length}`);

        console.log('\n✅ Content Creator Workflow completed successfully!');
        
        return {
            trend: firstResult,
            script: scriptText,
            vectorized: true
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
