# Supabase Vector Search App (React Native + Expo)

This project is a React Native Expo app that demonstrates semantic vector search using Supabase pgvector and OpenAI embeddings. It was originally built from an Expo starter, now upgraded to a full-stack AI demo.

## Features

* 🔍 Perform semantic search on employee data using vector embeddings
* ⚡ Powered by Supabase Edge Functions + pgvector
* 🤖 Embeddings generated via OpenAI models
* 🔐 Uses Supabase cloud secrets for environment security
* 📱 Built with Expo Router for simple navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native (Expo) |
| Backend | Supabase Edge Functions (Deno) |
| Vector Database | Supabase Postgres + pgvector |
| Embedding Model | OpenAI `text-embedding-3-small` |
| Cloud Env Mgmt | Supabase Secrets CLI |

## Setup Guide

### 1️⃣ Clone the repo
```bash
git clone  https://github.com/Ali-Khan04/supabase-vector-search-app.git
cd supabase-vector-search-app
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the app
```bash
npx expo start
```

You can run it on:
* Expo Go (for testing)
* Android Emulator / iOS Simulator


## 🔐 Supabase Secrets (Cloud Environment)

This project uses Supabase Secrets to securely store environment variables — instead of local `.env` files.

When you deploy an Edge Function, secrets are automatically injected into the Deno runtime. 

### Setting Secrets

To add or update secrets in your project:
```bash
npx supabase secrets set \
  OPENAI_API_KEY="sk-proj-xxxxxxxxxxxx" \
  PROJECT_URL="https://your-project.supabase.co" \
  SERVICE_ROLE_KEY="your-service-role-key"
```

Check existing secrets:
```bash
npx supabase secrets list
```

✅ These are stored in Supabase's cloud environment, not locally.

##  How It Works

### 1️⃣ `embed_batch` Function
One-time function that reads your employee table and fills the `embedding` column using OpenAI.

### 2️⃣ `embed` Function
Handles two modes:
* `insert` → Add a new record and auto-generate its embedding
* `search` → Generate an embedding for a query and find similar rows

### 3️⃣ React Native App
* Sends queries to the `embed` function via Supabase Edge Function endpoint
* Displays semantic search results directly in-app

## Example Query

You can search:
```
"Find marketing employees with bonuses"
```

and get results ranked by semantic similarity.

