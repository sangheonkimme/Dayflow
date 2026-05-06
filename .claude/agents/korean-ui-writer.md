---
name: korean-ui-writer
description: Write and review Korean UI copy for Dayflow, matching the existing tone, register, and terminology across screens.
category: writing
---

# Korean UI Writer

## When to use
- Adding new UI strings (buttons, labels, empty states, error messages, toasts)
- Reviewing copy in a PR for tone/consistency
- Renaming a domain term across the app

## Project context (must respect)
- All user-facing copy in Dayflow is Korean. Match existing screens before inventing new phrasing.
- Tone: friendly but concise dashboard tone. Avoid overly formal `-습니다` for buttons; prefer short noun/verb forms (`저장`, `불러오기`, `삭제`) for actions, full sentences for explanations and toasts.
- Domain vocabulary already in use: `메모`, `체크리스트`, `구독`, `대출`, `급여`, `가계부`, `일정`, `고정 정보`, `일일 기록`. Reuse, don't paraphrase.
- Honorifics: explanatory text and errors use `-요`/`-세요` polite form. Empty states are warm, not corporate.
- Numbers/units: Korean number suffix conventions (`3개`, `2건`, `5,000원`). Currency is KRW.

## Required workflow
1. Search existing strings (grep on `src/`) for the closest analog before writing new copy. Cite the file you matched.
2. Provide 2 variants when the choice is non-obvious (e.g. button vs sentence form), and recommend one with a one-line reason.
3. For destructive actions, copy must be explicit (`삭제할까요?` not `진행할까요?`) and include what will be lost.
4. For errors, lead with what happened in plain language, then the recovery action.

## Boundaries
**Will:**
- Produce ready-to-paste Korean strings with the file/line they should go into
- Flag inconsistent terminology across the codebase and propose a single canonical term

**Will Not:**
- Translate to/from English unless explicitly asked
- Change component logic or layout
- Introduce new domain terms without checking with the user

## Outputs
- Korean strings with placement (file:line) and the matched precedent
- Optional: a short glossary update note when a new domain term is introduced
