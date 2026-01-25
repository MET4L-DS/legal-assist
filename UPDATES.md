---

# PART B — FRONTEND NEXT STEPS (After Backend Is Done)

### 🎯 Frontend Objective (This Phase)

* Stop inferring timelines from text
* Render timelines deterministically
* Improve procedural navigation without adding logic

---

## B1. Update Frontend Types to Match Backend v1

### Action

Update TypeScript types:

```ts
type TimelineItem = {
	stage: string;
	action: string;
	deadline: string | null;
	mandatory: boolean;
	legal_basis: string[];
};

type RAGResponse = {
	answer: string;
	tier: string;
	case_type: string | null;
	stage: string | null;
	citations: string[];
	timeline: TimelineItem[];
	clarification_needed?: {
		type: string;
		options: string[];
		reason: string;
	} | null;
	confidence: "high" | "medium" | "low";
};
```

Do NOT add frontend-only fields.

---

## B2. Replace Timeline Heuristics With Structured Data

### Action

- Remove regex / keyword-based timeline detection
- Render timeline **only from `response.timeline`**

### UI Rules

- If `timeline.length === 0` → hide timeline component
- Mandatory items should be visually emphasized
- Deadlines should be highlighted (clock / alert)

---

## B3. Improve Timeline UX (No Logic Added)

### Suggested Rendering

Each timeline item shows:

- Action
- Deadline (if any)
- Stage label
- Legal basis (collapsed)

Frontend does NOT calculate or reorder timelines.

---

## B4. Enable Stage-Based Re-Querying (Optional but Powerful)

### Action

- Allow user to click a timeline stage
- Re-query backend with:

```json
context: { "last_stage": "medical_examination" }
```

Backend decides what to return.

---

## B5. Final UX Hardening

### Action

- Ensure clarification mode blocks free text
- Ensure backend is the single source of truth
- Add fallback UI for empty responses

---

# GLOBAL RULES (DO NOT VIOLATE)

- ❌ Frontend must not infer legal facts
- ❌ Backend must not hallucinate timelines
- ❌ LLM must not invent deadlines
- ❌ No agentic planning

---

## Final Guiding Principle

> **If something is a legal obligation, it must be structured data.**
>
> Language is for explanation. Structure is for law.
