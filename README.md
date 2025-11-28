# AI Weather Agent Challenge

A conversational AI agent capable of understanding natural language, identifying user intent, and providing real-time weather data through tool calling.

## Project Overview

This project demonstrates the implementation of a full-stack AI application using a serverless architecture. The agent utilizes Cloudflare Workers AI (Llama 3) for natural language processing and interacts with external APIs (Open-Meteo) to retrieve geocoding and forecast data. The frontend is built with SvelteKit, featuring a real-time streaming chat interface.

## Key Features

* **Natural Language Processing:** Powered by Cloudflare Workers AI (Llama 3 model).
* **Tool Calling:** Implementation of custom tools for location retrieval (Geocoding) and weather forecasting.
* **Real-time Streaming:** The UI streams the AI response token by token for an enhanced user experience.
* **Monorepo Architecture:** Managed via pnpm workspaces for efficient dependency handling between backend and frontend.
* **Serverless Deployment:** Designed to run on Cloudflare Workers (Tier: Free).

## Technology Stack

* **Backend:** Cloudflare Workers, Hono, Vercel AI SDK, Zod.
* **Frontend:** SvelteKit, TailwindCSS.
* **Language:** TypeScript.
* **Package Manager:** pnpm.

## Installation and Setup

### Prerequisites
* Node.js (LTS version)
* Cloudflare Account (required for Workers AI)
* pnpm package manager

### 1. Installation
Clone the repository and install dependencies from the root directory:

```bash
pnpm install
```

### 2. Backend Configuration
The backend runs on port 8787. Navigate to the backend directory and start the development server:

```bash
cd packages/backend
npx wrangler login
pnpm dev
Note: The login step is only required upon the first run.
```

### 3. Frontend Configuration
The frontend runs on port 5173. Open a new terminal window, navigate to the frontend directory, and start the application:

```bash
cd packages/frontend
pnpm dev
Access the web interface at: http://localhost:5173
```

## Usage Example
The agent accepts natural language queries in Italian. Examples:

"Che tempo fa a Roma?" "Serve l'ombrello a Milano domani?"

The system will:

1. Analyze the intent.

2. Execute the geocode tool to find coordinates.

3. Execute the forecast tool to retrieve weather data.

4. Generate a natural language response based on the retrieved data.
