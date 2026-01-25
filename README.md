# Legal RAG Frontend

A Next.js frontend for the Tiered Legal Retrieval-Augmented Generation (RAG) system. This interface connects to the FastAPI backend to provide legal guidance on Indian laws (BNS, BNSS, BSA), standard operating procedures (SOPs), evidence standards, and victim compensation schemes.

## 🚀 Features Implemented

### Phase 1: Minimal Chat (✅ Completed)

- **Chat Interface**: clean, responsive chat UI using Shadcn/UI components.
- **RAG Integration**: Connects to the FastAPI backend (`/rag/query`) to fetch legal answers.
- **Input Handling**: Text input with loading states.

### Phase 2: Structured Output (✅ Completed)

- **Markdown Rendering**: AI responses are rendered with full rich text support (Headings, Lists, Bold) using `react-markdown` and Tailwind Typography.
- **Tier-Aware Responses**: Displays badges for different response tiers (mapped from backend `tier_info`):
    - 🔴 **Tier 1**: Procedural/Urgent (SOPs for sensitive cases)
    - 🔵 **Tier 2**: Evidence & Compensation
    - ⚪ **Tier 3**: General Procedures
    - ⚪ **Standard**: General Legal Info
- **Citations**: Structured display of legal sources (Sections of BNS/BNSS, SOPs, etc.) in a collapsible card.

### Phase 3: Clarification UX (✅ Completed - Pending Backend Support)

- **Clarification Handling**: Automatically detects when the backend needs more context (e.g., "What type of crime?") and renders interactive buttons.
    - _Note: The current backend architecture does not emit the `clarification_needed` signal. This feature is implemented in the frontend for future compatibility._
- **Context Management**: Maintains session context (`last_case_type`, `last_stage`) to support multi-turn conversations.
- **Dynamic Updates**: User selections update the context and trigger follow-up queries.

### Phase 4: Polish (✅ Completed)

- **Loading States**: Visual feedback during API calls ("Thinking...").
- **Error Handling**: Graceful error messages if backend is unreachable.
- **Auto-Scrolling**: Smart scrolling behavior to keep the latest message in view.
- **Accessibility**: Aria labels and keyboard navigation support via Radix UI primitives.

### Phase 5: Trust & Safety UI (✅ Completed)

- **Strict Type Alignment**: Frontend types now strictly enforce the backend contract, specifically handling the nested `tier_info` structure via an adapter pattern.
- **Enhanced Clarification Mode**: The chat input is strictly disabled when the AI requests clarification, forcing the user to select an option. This prevents conversation breakage and ensures the backend gets the specific context it needs (e.g., specific crime type).
- **Critical Timeline Visualization**: Displays a dedicated `Timeline` component populated by **structured backend data** (not regex parsing). It distinguishes "Critical User Actions" (Red) vs. "Procedural Steps" (Gray) and features **contextual tooltips**, **collapsible sections**, **sticky headers** for mobile, and a **"Copy as Checklist"** tool.
- **Trust Signals**: Includes "Verified from Government SOPs" status, "Last updated: 2023 laws" metadata, and dynamic **Confidence Badges** (Shield icons).
- **Safety Notices**: Prominent yellow warning banners appear when backend confidence is low, ensuring users are alerted to potential variability in legal procedures.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + `@tailwindcss/typography`
- **UI Library**: shadcn/ui (Radix UI)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Markdown**: `react-markdown`

## ⚙️ Setup & Installation

### Prerequisites

1. **Backend Service**: Ensure the Python FastAPI backend is running on `http://127.0.0.1:8000`.
    - See `BACKEND_ARCHITECTURE.md` for backend setup instructions.

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_RAG_API_BASE=http://127.0.0.1:8000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
app/
├── globals.css         # Global styles & Tailwind configuration
├── layout.tsx          # Root layout
└── page.tsx            # Main entry point (ChatContainer)

components/
├── chat/
│   ├── ChatContainer.tsx    # Main logic & state
│   ├── ChatMessage.tsx      # Message rendering (Markdown + Tiers)
│   ├── ChatInput.tsx        # User input
│   ├── ClarificationPrompt.tsx # Disambiguation UI
│   └── Timeline.tsx         # Visual component for critical deadlines
└── ui/                      # Shared Shadcn components

lib/
├── api/
│   └── rag.ts              # API client for backend
├── types/
│   └── rag.ts              # TypeScript interfaces (RAGResponse, etc.)
└── utils.ts                # Helper functions
```

## 📝 Usage Guide

1. **Ask a Question**: Type a natural language query (e.g., "What to do in case of robbery?").
2. **View Response**: Read the structured guide provided by the AI.
3. **Check Citations**: Look at the bottom of the message for specific legal sections used.
4. **Clarify**: If the AI asks for details (e.g., "Is this a cognizable offense?"), click the provided options to refine the answer.
