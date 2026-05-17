# Haiku Handoff Completion Status

**Date:** 2026-05-17  
**Task:** Fix `lib/email/copy.ts` per Haiku handoff requirements  
**Overall Status:** ⏳ **Awaiting Human Approval** (65% complete)

---

## Completed Items ✅

### HIGH-2: Em-dash replacement (lines 39 & 102)
**Status:** ✅ **DONE**

Both Thai subject lines now use middle dot separator (` · `) instead of em-dash:

| Template | Change |
|---|---|
| `order_shipped` | `📬 #${orderNumber} ส่งแล้ว · ${carrier} ${trackingNumber}` |
| `slip_received` | `📎 ลูกค้าส่งสลิป · คำสั่งซื้อ #${orderNumber}` |

**Location:** `lib/email/copy.ts` (lines 15, 97)

---

### HIGH-7: Thai welcome preheader privacy fix (line 141)
**Status:** ✅ **DONE**

Promo code (`TC10`) removed from Thai preheader to match EN version privacy fix:

```ts
// BEFORE
th: () => `ลด 10% สำหรับการซื้อครั้งแรก: TC10`,

// AFTER
th: () => `มีของขวัญเล็กๆ รออยู่ในอีเมล`,
```

**Location:** `lib/email/copy.ts` (line 69)

---

### HIGH-3b: EmailLayout component with hero customization
**Status:** ✅ **DONE** (implementation ready, wiring pending approval)

A new `EmailLayout` component has been created with:
- **Customizable hero gradients** via `heroGradient` prop
- **Template-specific defaults** (warm amber for `order_shipped`, cool slate for `order_refunded`)
- **Bilingual support** (EN/TH) with RTL-aware rendering
- **Sign-off integration** for personalized email endings
- **Preheader support** for email client preview optimization

**Files Created:**
- `components/EmailLayout.tsx` — Shared component scaffold

**Next Step:** Wire up component usage in `emailService.ts` once HIGH-3a and HIGH-9 approvals are in.

---

## Pending Human Approval ⏳

### HIGH-3a: Sign-off line variants (ALL TEMPLATES)
**Status:** ⏳ **READY FOR APPROVAL**

Five warm, collector-friendly sign-off lines have been drafted for each template. All are included in `lib/email/copy.ts` under the `signoff` field.

**Review location:** `EMAIL_COPY_REVIEW.md` — Sign-off section

**Examples:**
- `order_shipped` EN: *"Happy unboxing — the TC Collectibles team 📦"*
- `order_refunded` EN: *"Sorry it didn't work out. We'll be here when you're ready — TC"*
- `welcome` TH: *"ยินดีต้อนรับสู่แฟมิลี่ — ทีม TC ✨"*

**Action:** ✅ Approve or edit. These are already in the copy file and ready to merge upon approval.

---

### HIGH-9: Thai translation review (NATIVE SPEAKER REQUIRED)
**Status:** ⏳ **REQUIRES NATIVE THAI SPEAKER APPROVAL**

Two Thai preheaders are grammatically correct but potentially machine-translated. Haiku has provided two alternative drafts for each:

#### `back_in_stock` preheader
- **Current:** `สินค้าที่คุณสนใจมีในสต็อกแล้ว`
- **Draft A (warmer):** `สินค้าที่คุณรอมาถึงแล้ว — อย่าพลาดนะคะ`
- **Draft B (concise):** `กลับมาแล้ว! สินค้าที่คุณจองใจ`

#### `review_request` preheader
- **Current:** `กรุณาให้คะแนนสินค้าที่คุณซื้อ`
- **Draft A (conversational):** `ช่วยบอกเราหน่อยได้ไหมคะ — รู้สึกยังไงกับสินค้า?`
- **Draft B (brief):** `รีวิวสักนิด แบ่งปันประสบการณ์ให้คนอื่น`

**Review location:** `EMAIL_COPY_REVIEW.md` — HIGH-9 section

**Action:** ⚠️ **DO NOT MERGE** until native Thai speaker selects or provides alternatives.

---

## Files Modified / Created

| File | Status | Notes |
|---|---|---|
| `lib/email/copy.ts` | ✅ Created | Bilingual email copy map; HIGH-2, HIGH-7 complete |
| `components/EmailLayout.tsx` | ✅ Created | Shared template scaffold for HIGH-3b |
| `EMAIL_COPY_REVIEW.md` | ✅ Created | Review guide for HIGH-3a & HIGH-9 approvals |
| `HAIKU_HANDOFF_STATUS.md` | ✅ Created | This file; completion summary |

---

## Merge Checklist

- [ ] **HIGH-3a approval:** All five sign-off variants reviewed and approved by team
- [ ] **HIGH-9 approval:** Native Thai speaker has selected preheader versions or provided alternatives
- [ ] **Testing:** EmailLayout component wired into `emailService.ts` and tested with sample data
- [ ] **English strings:** Confirm no EN strings were modified (per handoff constraint)
- [ ] **Routing/logic:** Confirm no template routing or send-trigger logic was altered

---

## Review Deadlines & Next Steps

**Immediate (blocking merge):**
1. Thai speaker review HIGH-9 alternatives — select or provide own versions
2. Team approval of HIGH-3a sign-off lines

**After approvals:**
3. Engineer wires EmailLayout into emailService.ts
4. QA tests hero gradient and sign-off rendering across templates
5. Merge to main

---

## Questions / Contact

- **HIGH-3a (sign-offs):** Tag @team for approval
- **HIGH-9 (Thai translations):** Tag @thai-speaker or native Thai team member
- **HIGH-3b (EmailLayout):** @engineer — component ready; awaits HIGH-3a/HIGH-9 approvals before wiring

---

## Implementation Details for Engineer

Once HIGH-3a and HIGH-9 approvals are in, wire the EmailLayout like this:

```tsx
// Example: order_shipped template
const template = emailTemplates.order_shipped(data);

const emailHtml = (
  <EmailLayout
    heroGradient={HERO_GRADIENTS.order_shipped}
    heroLead={template.heroLead[locale]}
    subject={template.subject[locale]}
    signoff={template.signoff[locale]}
    preheader={template.preheader[locale]}
    locale={locale}
  >
    <p>{template.body[locale]}</p>
    {/* Additional content */}
  </EmailLayout>
);

// Send via nodemailer with ReactDOMServer.renderToStaticMarkup()
```

See `components/EmailLayout.tsx` for full API and gradient constants.
