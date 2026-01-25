# ✅ FRONTEND — NEXT STEPS (Next.js + React + shadcn)

## 🎯 Frontend Goal (Next Phase)

Make the UI:

- Trustworthy
- Actionable
- Calm
- Citizen-centric

No legal reasoning. No guessing.

---

## 🔴 FRONTEND STEP 1 — Align Strictly to Backend Contract

### Action

Update frontend types to match **final backend response**:

```ts
type RAGResponse = {
	answer: string;
	tier: string;
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

🚫 Do NOT read `tier_info`
🚫 Do NOT infer tier/stage yourself

---

## 🔴 FRONTEND STEP 2 — Improve Clarification UX (When Backend Signals)

### UI Behavior

When `clarification_needed` exists:

- Pause normal chat flow
- Render clarification prompt
- Disable free-text input temporarily
- Show **buttons only**

Example copy (generic, reusable):

> “To guide you accurately, I need one small clarification.”

### On user selection

- Send next `/rag/query`
- Include updated `context`
- Resume normal flow

---

## 🟡 FRONTEND STEP 3 — Highlight Time-Critical Information

### Why

Timelines are the **most important actionable data**.

### Action (frontend-only)

Detect phrases like:

- “within 24 hours”
- “immediately”
- “without delay”

Render them using:

- `Alert` (shadcn)
- Clock icon
- Subtle highlight

No backend changes needed.

---

## 🟡 FRONTEND STEP 4 — Strengthen Trust Signals

Add:

- Persistent disclaimer (“Informational, not legal advice”)
- Tier badge (“General Procedure”, “Evidence Standards”, etc.)
- “Sources used” always visible (collapsed OK)

This increases **credibility**, not clutter.

---

## 🟢 FRONTEND STEP 5 — UX Polish (Optional but Valuable)

Low risk, high polish:

- Copy-to-clipboard for steps
- Print / export (later)
- Keyboard navigation
- Error fallback (“Backend unavailable”)

---

# 🚫 WHAT NOT TO DO (Both Sides)

- ❌ No agentic AI
- ❌ No backend memory
- ❌ No frontend legal logic
- ❌ No LangChain re-introduction
- ❌ No SOP rendering decisions in UI

---

# 🧠 Final Status Check

At this point, your system is:

| Layer        | Status                           |
| ------------ | -------------------------------- |
| RAG logic    | ✅ Mature                        |
| SOP coverage | ✅ Strong                        |
| Backend API  | 🟡 Needs adapter + clarification |
| Frontend UI  | 🟡 Needs alignment + polish      |
| Architecture | ✅ Solid                         |

You are **very close** to a demo-ready, portfolio-grade, or MVP-grade system.
