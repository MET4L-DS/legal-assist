# Frontend Integration Plan for Legal RAG System

> **Purpose:**
> This document serves as a **single source of truth** for integrating the new **Tiered Legal RAG FastAPI backend** with the frontend. It is written to be **explicit, deterministic, and machine-readable**, so that **GitHub Copilot / Copilot Agent** can reliably follow it during development.

---

## 1. System Overview

### Architecture Summary

```
Frontend (Next.js / React)
   ↓ HTTPS
FastAPI Server (RAG API)
   ↓
Tiered Legal RAG Engine
(Tier-1 SOP, Tier-2 Evidence/Compensation, Tier-3 General SOP)
```

### Key Principles

- Frontend is **presentation-only**
- Backend is **authoritative for all legal logic**
- No agentic reasoning in frontend
- No duplication of RAG logic in UI
- All legal reasoning happens in backend

---

## 2. Technology Stack (Frontend)

- Framework: **Next.js (App Router)**
- React: **React 19**
- Language: **TypeScript**
- UI: **shadcn/ui + Tailwind CSS**
- Auth: **Firebase Auth**
- Storage: **Firestore (chat history only)**
- API Backend: **FastAPI (external service)**

---

## 3. Backend API Contract (Mandatory)

### Base URL (Local Development)

```
http://127.0.0.1:8000
```

Frontend must read this from an environment variable:

```ts
NEXT_PUBLIC_RAG_API_BASE=http://127.0.0.1:8000
```

---

## 4. Required API Endpoints

### 4.1 POST /rag/query (PRIMARY ENDPOINT)

**URL**
```
POST {BASE_URL}/rag/query
```

**Request Body**
```json
{
  "query": "string (user question)",
  "context": {
    "last_case_type": "string | null",
    "last_stage": "string | null"
  },
  "no_llm": false,
  "verbose": false
}
```

**Rules**
- `query` is always required
- `context` is optional and comes from previous turn
- `no_llm` and `verbose` must default to `false`

---

**Response Body**
```json
{
  "answer": "string",
  "tier": "tier1 | tier2_evidence | tier2_compensation | tier3 | standard",
  "case_type": "string | null",
  "stage": "string | null",
  "citations": ["string"],
  "clarification_needed": {
    "type": "string",
    "options": ["string"],
    "reason": "string"
  } | null,
  "confidence": "high | medium | low"
}
```

---

### 4.2 GET /health (RECOMMENDED)

**Purpose:** frontend readiness check

```
GET {BASE_URL}/health
```

**Response**
```json
{
  "status": "ok",
  "rag_loaded": true
}
```

Frontend should disable chat if backend is offline.

---

## 5. Frontend Data Models (TypeScript)

### 5.1 RAG Response Type

```ts
export type RAGResponse = {
  answer: string;
  tier: "tier1" | "tier2_evidence" | "tier2_compensation" | "tier3" | "standard";
  case_type: string | null;
  stage: string | null;
  citations: string[];
  clarification_needed?: {
    type: string;
    options: string[];
    reason: string;
  } | null;
  confidence: "high" | "medium" | "low";
};
```

---

## 6. Clarification Handling (CRITICAL)

### Rules

- Frontend **does not decide** what clarification to ask
- Backend explicitly signals ambiguity via `clarification_needed`
- Frontend only **renders** clarification politely

### Flow

1. Backend returns `clarification_needed`
2. Frontend displays reason + option buttons
3. User selects an option
4. Frontend sends **new POST /rag/query** with updated `context`
5. No new endpoints are introduced

### Example UI Text (Non-Hardcoded)

> "To guide you accurately, I need one small clarification."

---

## 7. Chat State Management

### What to Store (Allowed)

```ts
{
  sessionId: string;
  last_case_type?: string;
  last_stage?: string;
}
```

### What NOT to Store

- Retrieved SOP blocks
- Evidence blocks
- Compensation rules
- Tier routing decisions

All legal state must be recomputed by backend every time.

---

## 8. Firebase Usage Rules

### Allowed

- Authentication (Firebase Auth)
- Chat history persistence
- Session continuity

### Forbidden

- Legal logic
- Tier logic
- SOP storage
- Evidence rules

---

## 9. UI Rendering Rules (Tier-Aware)

### Tier-1 / Tier-3 (Procedural)

Render answers as structured sections:

```
🚨 Immediate Steps
👮 Police Duties
⚖️ Legal Basis
🚩 If Police Do Not Act
```

### Tier-2 (Evidence / Compensation)

Use Tabs:
- Procedure
- Evidence Standards
- Compensation
- Citations

### Standard Tier

- Plain answer
- Citations collapsed

---

## 10. What the Frontend MUST NOT Do

- ❌ Decide tier
- ❌ Decide offence type
- ❌ Re-rank answers
- ❌ Merge tiers
- ❌ Perform legal reasoning
- ❌ Implement agentic AI

Frontend is a **thin, deterministic renderer**.

---

## 11. Development Phases

### Phase 1 – Minimal Chat
- Text input
- POST /rag/query
- Render `answer`

### Phase 2 – Structured Output
- Tier badges
- Section headers
- Citations drawer

### Phase 3 – Clarification UX
- ClarificationPrompt component
- Context override logic

### Phase 4 – Polish
- Loading states
- Error handling
- Accessibility

---

## 12. Single Guiding Rule (For Copilot)

> **When in doubt, defer to the backend.**
>
> The backend is the legal brain. The frontend never guesses.

---

**Status:** Approved reference plan for frontend implementation

