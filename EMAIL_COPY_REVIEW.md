# Email Copy Review — HIGH-3a & HIGH-9 Approvals

**Date:** 2026-05-17  
**Status:** ⏳ Awaiting human review and approval before merge

---

## Summary of Changes

✅ **COMPLETED (ready for production):**
- HIGH-2: Em-dashes replaced with middle dots (· ) in Thai subject lines
- HIGH-7: Thai welcome preheader updated to hide promo code
- HIGH-3b: EmailLayout component structure prepared (see details below)

⏳ **PENDING HUMAN APPROVAL:**
- HIGH-3a: Sign-off line variants (all templates)
- HIGH-9: Thai translation alternatives (`back_in_stock` & `review_request` preheaders)

---

## HIGH-3a — Sign-Off Line Variants (Ready for Approval)

These warm, collector-friendly sign-offs have been drafted for each template. **Select or approve one per template before merge.**

### order_shipped
| Language | Draft |
|---|---|
| EN | "Happy unboxing — the TC Collectibles team 📦" |
| TH | "เปิดกล่องสนุกๆ นะคะ — ทีม TC Collectibles 📦" |

**Status:** ✅ Ready to merge if approved

---

### order_refunded
| Language | Draft |
|---|---|
| EN | "Sorry it didn't work out. We'll be here when you're ready — TC" |
| TH | "เสียใจด้วยนะคะ เราพร้อมดูแลเสมอ — ทีม TC" |

**Status:** ✅ Ready to merge if approved

---

### welcome
| Language | Draft |
|---|---|
| EN | "Welcome to the club — TC Collectibles ✨" |
| TH | "ยินดีต้อนรับสู่แฟมิลี่ — ทีม TC ✨" |

**Status:** ✅ Ready to merge if approved

---

### back_in_stock
| Language | Draft |
|---|---|
| EN | "Grab it before it walks — TC Collectibles 🏃" |
| TH | "รีบเลยก่อนหมด — ทีม TC Collectibles 🏃" |

**Status:** ✅ Ready to merge if approved

---

### review_request
| Language | Draft |
|---|---|
| EN | "Your words shape the community — thank you, TC" |
| TH | "รีวิวของคุณมีค่ามาก ขอบคุณนะคะ — ทีม TC" |

**Status:** ✅ Ready to merge if approved

---

## HIGH-9 — Thai Translation Review (MUST BE APPROVED BY NATIVE SPEAKER)

Two Thai preheaders need native-speaker review. Current versions are grammatically valid but feel machine-translated.

### `back_in_stock` preheader

#### Current (potentially awkward)
```
สินค้าที่คุณสนใจมีในสต็อกแล้ว
"The product you're interested in is now in stock."
```

#### Haiku Draft A — Warmer, more urgent
```
สินค้าที่คุณรอมาถึงแล้ว — อย่าพลาดนะคะ
"The item you've been waiting for is here — don't miss it!"
```
*Character: Conversational, adds urgency*

#### Haiku Draft B — Concise
```
กลับมาแล้ว! สินค้าที่คุณจองใจ
"It's back! The item you had your eye on"
```
*Character: Energetic, playful*

**→ NEEDS NATIVE THAI SPEAKER APPROVAL** — Select A, B, or provide your own

---

### `review_request` preheader

#### Current (potentially awkward)
```
กรุณาให้คะแนนสินค้าที่คุณซื้อ
"Please rate the product you purchased."
```

#### Haiku Draft A — Conversational
```
ช่วยบอกเราหน่อยได้ไหมคะ — รู้สึกยังไงกับสินค้า?
"Could you tell us a bit? How did you feel about the product?"
```
*Character: Friendly, inviting*

#### Haiku Draft B — Brief
```
รีวิวสักนิด แบ่งปันประสบการณ์ให้คนอื่น
"A quick review — share your experience with others"
```
*Character: Direct, emphasizes community benefit*

**→ NEEDS NATIVE THAI SPEAKER APPROVAL** — Select A, B, or provide your own

---

## HIGH-3b Implementation Notes

### Component Structure

An `EmailLayout` component has been prepared with the following signature:

```tsx
interface EmailLayoutProps {
  heroGradient?: {
    from: string;  // e.g., "#F59E0B"
    to: string;    // e.g., "#D97706"
  };
  heroLead: string;
  subject: string;
  children: React.ReactNode;
  locale: 'en' | 'th';
  signoff?: string;
}
```

### Current Defaults
- Default gradient: Purple (`#667eea` → `#764ba2`)
- Will be overridden for `order_shipped` and `order_refunded` per the handoff spec

### Wiring Required
- `order_shipped`: Warm amber gradient, "Your order is on its way!" (EN) / "สินค้ากำลังมาหาคุณแล้ว!" (TH)
- `order_refunded`: Cool slate gradient, "Your refund has been processed." (EN) / "ดำเนินการคืนเงินเรียบร้อยแล้ว" (TH)

---

## Approval Checklist

Before merging, confirm:

- [ ] **HIGH-3a:** All five sign-off variants approved
- [ ] **HIGH-9:** Native Thai speaker has selected preheader versions for `back_in_stock` and `review_request`
- [ ] **HIGH-3b:** EmailLayout component wiring complete and tested
- [ ] No English strings modified (per handoff constraint)
- [ ] No template logic or routing altered (per handoff constraint)

---

## Next Steps

1. **Thai speaker:** Review HIGH-9 alternatives and provide selection or custom options
2. **Team:** Approve HIGH-3a sign-offs or suggest edits
3. **Engineer:** Once HIGH-3a & HIGH-9 approved, wire up EmailLayout component and run tests
4. **Merge:** Only after all approvals are in place
