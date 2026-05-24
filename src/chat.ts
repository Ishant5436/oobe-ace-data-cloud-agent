import { setupAgent } from './agent';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function runChat() {
    const query = process.argv[2];
    if (!query) {
        console.log(JSON.stringify({ error: "No query provided" }));
        process.exit(1);
    }

    const apiToken = process.env.ACE_DATA_CLOUD_API_KEY;
    const privateKey = process.env.SOLANA_PRIVATE_KEY;
    if (!apiToken || !privateKey) {
        console.log(JSON.stringify({ error: "Missing env variables" }));
        process.exit(1);
    }

    try {
        const client = setupAgent(apiToken, privateKey);
        
        // 1. Vectorize query
        const embeddingResponse: any = await client.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query
        });
        const queryVector = embeddingResponse.data?.[0]?.embedding;

        // 2. Search Memory (RAG)
        const memoryFilePath = path.join(process.cwd(), 'src', 'data', 'memory.json');
        let memory = [];
        if (fs.existsSync(memoryFilePath)) {
            memory = JSON.parse(fs.readFileSync(memoryFilePath, 'utf8'));
        }

        let bestMatch = null;
        let highestScore = -1;

        for (const item of memory) {
            if (item.vector && queryVector) {
                const score = cosineSimilarity(queryVector, item.vector);
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = item;
                }
            }
        }

        let contextPrompt = '';
        if (bestMatch && highestScore > 0.3) {
            contextPrompt = `\nContext from memory (Date: ${bestMatch.timestamp}):\nTrend: ${bestMatch.trend}\nScript: ${bestMatch.script}\n`;
        } else {
            contextPrompt = `\n(No relevant memories found in the database. The agent's memory bank is currently empty or unrelated.)\n`;
        }

        // 3. Generate Answer
        const systemPrompt = `You are an autonomous AI Agent that researches tech news. Answer the user's question using ONLY the provided Context from your memory bank. If the memory doesn't contain the answer, say you haven't researched that yet. Keep answers concise, cyber-punk, and professional.\n${contextPrompt}`;
        
        const chatResponse: any = await client.aichat.create({
            model: 'gpt-4o',
            question: `${systemPrompt}\n\nUser Question: ${query}`
        });

        const answer = chatResponse.answer || chatResponse.choices?.[0]?.message?.content || 'I have no response at this time.';
        
        console.log(JSON.stringify({
            answer: answer,
            retrievedContext: bestMatch ? bestMatch.trend : null,
            confidence: highestScore
        }));

    } catch (error: any) {
        console.log(JSON.stringify({ error: error.message }));
    }
}

runChat();
