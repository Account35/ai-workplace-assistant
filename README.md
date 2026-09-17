# AI Workplace Assistant

Build a modern, responsive web app called AI Workplace Productivity Assistant — a professional SaaS-style dashboard that uses AI to help users complete workplace tasks.

Core Features

1. Smart Email Generator

User enters the purpose, recipient/context, and key points.

AI dynamically generates the complete email.

Tone options: Formal, Friendly, Persuasive.

Generated emails must be editable.

Do not use hardcoded, generic, or template-based responses. Every email must be AI-generated based on the user's input.

2. AI Research Assistant

User can enter a topic, paste text, or provide a URL.

AI generates a summary, key insights, and practical recommendations based on the provided content.

All research results must be dynamically AI-generated. Do not display generic or predefined responses.

Make results editable.

3. AI Workplace Chatbot

Interactive AI chat interface for workplace-related questions and tasks.

AI should generate responses dynamically based on each user's prompt.

No hardcoded chatbot responses or preset answers.

UI & Design

Clean, modern, professional SaaS dashboard.

Light grey and dark colour palette.

Sidebar navigation for Email Generator, Research Assistant, and AI Chat.

Responsive desktop, tablet, and mobile design.

Professional cards, forms, buttons, and spacing.

Avoid colourful, playful, or gamified styling.

Technical Requirements

Frontend-only application.

No backend, database, authentication, or persistent data storage.

Do not save user inputs or generated outputs.

Connect the interface to an available AI model/API so responses are actually AI-generated in real time.

Use structured AI prompts for each feature.

Include loading states and clear error messages when AI generation fails.

Include a Responsible AI disclaimer reminding users to review AI-generated content before using it professionally.

Important: The application must function as a real AI productivity assistant. Do not substitute AI functionality with mock data, static examples, placeholder text, predefined answers, or generic responses.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aa827c4b-4490-49bc-a59d-009281442d23).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
