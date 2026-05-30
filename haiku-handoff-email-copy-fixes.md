# Haiku Handoff — `src/lib/email/copy.ts` fixes
**Date:** 2026-05-17  
**Assigned to:** Claude Haiku (automated pass)  
**Reviewer required:** Yes — HIGH-9 Thai copy must be approved by a native Thai speaker before merge.

---

## Context

`src/lib/email/copy.ts` holds all subject lines, preheaders, and body-copy strings for every transactional email in the TC Collectibles × TechCraft Lab system. It exports a bilingual (`en` / `th`) map keyed by email template name. The English strings were updated in commit `ab0e22d`; several Thai siblings were skipped. The issues below correct that gap.

---

## HIGH-2 — Remove em-dashes from Thai subject lines (lines 39 & 102)

### Problem
Two Thai subject-line strings still use `—` (U+2014 em-dash), which renders poorly on Thai-locale mail clients and is inconsistent with the separator style adopted in ab0e22d for the English versions.

### Exact changes

**Line 39** — order shipped subject (Thai)

```ts
// BEFORE
th: () => `📬 #${orderNumber} ส่งแล้ว — ${carrier} ${trackingNumber}`,

// AFTER
th: () => `📬 #${orderNumber} ส่งแล้ว · ${carrier} ${trackingNumber}`,
```

**Line 102** — slip-received subject (Thai)

```ts
// BEFORE
th: () => `📎 ลูกค้าส่งสลิป — คำสั่งซื้อ #${orderNumber}`,

// AFTER
th: () => `📎 ลูกค้าส่งสลิป · คำสั่งซื้อ #${orderNumber}`,
```

**Separator used:** ` · ` (space + U+00B7 middle dot + space). Match what EN versions now use. Do not use a plain hyphen.

---

## HIGH-3 — Add personality to email scaffolding

### Problem
Every template shares the same structural skeleton: gradient hero → H1 → paragraph → CTA button. No template-specific personality was added in the last round, making all emails feel identical.

### Required changes (two sub-tasks)

#### 3a — Hand-written sign-off variants (one per template)

After the CTA block in each template's HTML/copy, add a short signed-off line. Use the voice of the TC Collectibles team — warm, collector-friendly, slightly playful. Draft one per template:

| Template | EN sign-off draft | TH sign-off draft |
|---|---|---|
| `order_shipped` | *"Happy unboxing — the TC Collectibles team 📦"* | *"เปิดกล่องสนุกๆ นะคะ — ทีม TC Collectibles 📦"* |
| `order_refunded` | *"Sorry it didn't work out. We'll be here when you're ready — TC"* | *"เสียใจด้วยนะคะ เราพร้อมดูแลเสมอ — ทีม TC"* |
| `back_in_stock` | *"Grab it before it walks — TC Collectibles 🏃"* | *"รีบเลยก่อนหมด — ทีม TC Collectibles 🏃"* |
| `welcome` | *"Welcome to the club — TC Collectibles ✨"* | *"ยินดีต้อนรับสู่แฟมิลี่ — ทีม TC ✨"* |
| `review_request` | *"Your words shape the community — thank you, TC"* | *"รีวิวของคุณมีค่ามาก ขอบคุณนะคะ — ทีม TC"* |

These are **Haiku drafts**. Surface them for human approval before publishing.

#### 3b — Vary the lead block for `order_shipped` vs `order_refunded`

The hero section in both templates currently renders the same gradient + lock-up. Differentiate:

- **`order_shipped`:** Hero background → warm amber gradient (`#F59E0B` → `#D97706`). Lead copy: *"Your order is on its way!"* / TH: *"สินค้ากำลังมาหาคุณแล้ว!"*
- **`order_refunded`:** Hero background → cool slate gradient (`#64748B` → `#475569`). Lead copy: *"Your refund has been processed."* / TH: *"ดำเนินการคืนเงินเรียบร้อยแล้ว"*

Implement by passing a `heroGradient` and `heroLead` prop into the shared `EmailLayout` component, defaulting to the current purple gradient for templates not yet customised.

---

## HIGH-7 — Fix Thai welcome preheader leaking promo code (line 141)

### Problem
The English welcome preheader was changed to tease without revealing the code. The Thai version still spells out `TC10` in plain text, defeating the privacy fix and making A/B testing harder.

### Exact change

**Line 141** — welcome preheader (Thai)

```ts
// BEFORE
th: () => `ลด 10% สำหรับการซื้อครั้งแรก: TC10`,

// AFTER
th: () => `มีของขวัญเล็กๆ รออยู่ในอีเมล`,
```

English translation of new Thai: "There's a small gift waiting in the email." — matches the EN preheader's teaser tone without exposing the code string.

---

## HIGH-9 — Awkward Thai translations in `back_in_stock` and `review_request` preheaders

### Problem
The Thai preheaders for these two templates are grammatically valid but feel stiff / machine-translated. They need a native-Thai writer pass.

### Haiku's draft alternatives (for human review — do NOT merge without approval)

**`back_in_stock` preheader**

```ts
// Current (awkward)
th: () => `สินค้าที่คุณสนใจมีในสต็อกแล้ว`,

// Haiku draft A — warmer, more urgent
th: () => `สินค้าที่คุณรอมาถึงแล้ว — อย่าพลาดนะคะ`,

// Haiku draft B — concise
th: () => `กลับมาแล้ว! สินค้าที่คุณจองใจ`,
```

**`review_request` preheader**

```ts
// Current (awkward)
th: () => `กรุณาให้คะแนนสินค้าที่คุณซื้อ`,

// Haiku draft A — conversational
th: () => `ช่วยบอกเราหน่อยได้ไหมคะ — รู้สึกยังไงกับสินค้า?`,

// Haiku draft B — brief
th: () => `รีวิวสักนิด แบ่งปันประสบการณ์ให้คนอื่น`,
```

### Action required
A native Thai speaker (team or external reviewer) must select one of the draft alternatives for each, or supply their own. Until then, the current strings remain in production — **do not auto-merge HIGH-9 changes**.

---

## Checklist for Haiku

- [ ] HIGH-2: Replace both em-dashes in lines 39 and 102 with ` · `
- [ ] HIGH-3a: Insert sign-off lines per template (surface drafts for approval)
- [ ] HIGH-3b: Add `heroGradient` + `heroLead` props; wire up `order_shipped` and `order_refunded`
- [ ] HIGH-7: Replace line 141 Thai preheader with `มีของขวัญเล็กๆ รออยู่ในอีเมล`
- [ ] HIGH-9: Surface draft alternatives — **block merge on human Thai review**

## Do not touch
- English strings in any of the above lines (already fixed in ab0e22d)
- Any Thai strings not explicitly listed above
- Template logic, routing, or send-trigger code
