✅ Unique Source IDs & Law Chip Citations Implemented
Successfully implemented the new citation system with deterministic UIDs and law-based chips!

Changes Summary:
Component Change
Citation Format [1], [2] → [BNS:115], [BNSS:48], [NALSA]
Source ID id: 1 (ephemeral) → uid: "BNS_115" (deterministic)
New Field Added chip_label for UI display
Files Modified:
responder.py: Updated schema, added helper functions, modified context assembly & LLM prompt
app.py: Updated API contract to use uid and chip_label
API_DOCS.md: Added frontend integration guide with source registry pattern
Frontend Integration:
The API docs now include TypeScript examples for:

Global source registry (Map<uid, SourceData>)
Citation chip rendering with click handlers
Regex pattern for parsing chips: /\[([A-Z]+)(?::(\d+))?\]/g
Next Steps:
Restart the server to test the new system. The response will now include:

json
{
"answer": "You have rights during arrest [BNSS:48]...",
"sources": [{
"uid": "BNSS_48",
"chip_label": "[BNSS:48]",
...
}]
}
