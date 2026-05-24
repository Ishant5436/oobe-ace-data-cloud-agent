# Ace Data Cloud Autonomous Agent

An autonomous AI agent built for the **OOBE Protocol × Ace Data Cloud Bounty**. This agent seamlessly integrates on-chain identity via the Synapse Agent Protocol (SAP) and autonomously pays for multi-modal AI API usage using the X402 client.

## 🚀 Features & Bounty Fulfillment

This project completes all the requirements for the bounty:
- ✅ **Synapse Agent Protocol (SAP)**: The agent anchors its identity on-chain via the `@oobe-protocol-labs/synapse-sap-sdk`. (See `src/sap-agent.ts`)
- ✅ **Ace Data Cloud X402 Integration**: The agent uses the `X402PaymentInterceptor` to seamlessly handle Solana payments for data services when encountering a HTTP 402 Payment Required response. (See `src/agent.ts`)
- ✅ **Multi-Modal AI Workflow**: The agent chains **3 distinct Ace Data Cloud services** natively to complete a continuous workflow (See `src/workflows/content_creator.ts`):
  1. **Google Search**: Instantly scours the web for the latest artificial intelligence news.
  2. **AI Chat (GPT-4o)**: Summarizes the raw search results into a dramatic cinematic script.
  3. **OpenAI Embeddings**: Converts the generated text script into an instant semantic vector embedding.

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Solana Wallet Private Key with SOL for gas/payments.
- An Ace Data Cloud API Key.

## 📦 Setup & Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your Environment Variables:**
   Create a `.env` file in the root directory (do not commit this file) with the following values:
   ```env
   # Your Ace Data Cloud API Key
   ACE_DATA_CLOUD_API_KEY=your_ace_api_key_here

   # Base58 Encoded Solana Private Key
   SOLANA_PRIVATE_KEY=your_base58_private_key_here
   ```

## ⚡ Execution

### 1. Terminal Mode
Run the autonomous workflow directly in your terminal:
```bash
npm start
```

### 2. Dashboard UI Mode (Recommended)
Launch the beautiful Next.js Glassmorphism dashboard to deploy the agent visually:
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### What happens when you run it?
1. The agent initializes the **Ace Data Cloud** SDK and injects the **X402PaymentInterceptor** using your Solana Wallet.
2. It executes a Google Search for trending AI topics.
3. It passes the search results to GPT-4o to write a short dramatic summary.
4. It instantly vectorizes the summary script using OpenAI Embeddings.
5. If the APIs require payment, the X402 interceptor automatically signs the transaction on the Solana network behind the scenes.
