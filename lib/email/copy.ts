/**
 * Email Copy Strings — Bilingual (EN / TH)
 * All subject lines, preheaders, and body-copy for transactional emails
 * Exported as a map keyed by template name
 */

export const emailCopy = {
  order_shipped: {
    subject: {
      en: (orderNumber: string, carrier: string, trackingNumber: string) =>
        `📬 Order #${orderNumber} shipped via ${carrier} · ${trackingNumber}`,
      th: (orderNumber: string, carrier: string, trackingNumber: string) =>
        `📬 #${orderNumber} ส่งแล้ว · ${carrier} ${trackingNumber}`,
    },
    preheader: {
      en: () => `Your order is on its way! Track your shipment inside.`,
      th: () => `สินค้าของคุณกำลังมาแล้ว ติดตามการจัดส่งได้ที่นี่`,
    },
    heroLead: {
      en: () => `Your order is on its way!`,
      th: () => `สินค้ากำลังมาหาคุณแล้ว!`,
    },
    body: {
      en: () => `We're excited to get your items to you soon. Track your shipment using the information below.`,
      th: () => `เรารอที่จะส่งของให้คุณ ติดตามการจัดส่งได้ที่ด้านล่าง`,
    },
    signoff: {
      en: () => `Happy unboxing — the TC Collectibles team 📦`,
      th: () => `เปิดกล่องสนุกๆ นะคะ — ทีม TC Collectibles 📦`,
    },
  },

  order_refunded: {
    subject: {
      en: (orderNumber: string) => `Refund processed for Order #${orderNumber}`,
      th: (orderNumber: string) => `คืนเงินคำสั่งซื้อ #${orderNumber} เรียบร้อยแล้ว`,
    },
    preheader: {
      en: () => `Your refund has been processed.`,
      th: () => `ดำเนินการคืนเงินเรียบร้อยแล้ว`,
    },
    heroLead: {
      en: () => `Your refund has been processed.`,
      th: () => `ดำเนินการคืนเงินเรียบร้อยแล้ว`,
    },
    body: {
      en: () => `We've processed your refund. It may take 3-5 business days to appear in your account.`,
      th: () => `เราได้ดำเนินการคืนเงินแล้ว อาจใช้เวลา 3-5 วันทำการเพื่อให้เงินปรากฏในบัญชีของคุณ`,
    },
    signoff: {
      en: () => `Sorry it didn't work out. We'll be here when you're ready — TC`,
      th: () => `เสียใจด้วยนะคะ เราพร้อมดูแลเสมอ — ทีม TC`,
    },
  },

  welcome: {
    subject: {
      en: () => `Welcome to TC Collectibles! 🎉`,
      th: () => `ยินดีต้อนรับสู่ TC Collectibles! 🎉`,
    },
    preheader: {
      en: () => `There's a small gift waiting in the email.`,
      th: () => `มีของขวัญเล็กๆ รออยู่ในอีเมล`,
    },
    heroLead: {
      en: () => `Welcome to the family!`,
      th: () => `ยินดีต้อนรับสู่แฟมิลี่!`,
    },
    body: {
      en: () => `We're thrilled to have you join the TC Collectibles community. Exclusive deals and collector insights await.`,
      th: () => `เรายินดีที่คุณเข้าร่วมชุมชน TC Collectibles สิ่งอื่น ๆ ที่ดี และข้อมูลเชิงลึกจากผู้เก็บสะสมรอคุณอยู่`,
    },
    signoff: {
      en: () => `Welcome to the club — TC Collectibles ✨`,
      th: () => `ยินดีต้อนรับสู่แฟมิลี่ — ทีม TC ✨`,
    },
  },

  back_in_stock: {
    subject: {
      en: () => `Back in stock! The item you wanted is available now.`,
      th: () => `กลับมาแล้ว! สินค้าที่คุณต้องการมีให้บริการแล้ว`,
    },
    preheader: {
      en: () => `It's back! Don't miss it this time.`,
      th: () => `สินค้าที่คุณรอมาถึงแล้ว — อย่าพลาดนะคะ`,
    },
    body: {
      en: () => `The collectible you've been waiting for is back in our inventory. Limited quantities available — grab yours before it's gone.`,
      th: () => `สินค้าสะสมที่คุณรอมาถึงแล้ว จำนวนจำกัด — สั่งของคุณตอนนี้ก่อนหมด`,
    },
    signoff: {
      en: () => `Grab it before it walks — TC Collectibles 🏃`,
      th: () => `รีบเลยก่อนหมด — ทีม TC Collectibles 🏃`,
    },
  },

  review_request: {
    subject: {
      en: () => `Share your thoughts on your purchase`,
      th: () => `แบ่งปันความคิดเห็นของคุณเกี่ยวกับการซื้อ`,
    },
    preheader: {
      en: () => `Your review helps the community.`,
      th: () => `รีวิวของคุณช่วยชุมชน`,
    },
    body: {
      en: () => `We'd love to hear how you're enjoying your items. Your honest feedback helps fellow collectors make informed decisions.`,
      th: () => `เราอยากรู้ว่าคุณสนใจของคุณแค่ไหน ความเห็นซื้อขายของคุณช่วยให้ผู้เก็บสะสมคนอื่นตัดสินใจได้อย่างชาญฉลาด`,
    },
    signoff: {
      en: () => `Your words shape the community — thank you, TC`,
      th: () => `รีวิวของคุณมีค่ามาก ขอบคุณนะคะ — ทีม TC`,
    },
  },

  slip_received: {
    subject: {
      en: (orderNumber: string) => `Payment slip received for Order #${orderNumber}`,
      th: (orderNumber: string) => `📎 ลูกค้าส่งสลิป · คำสั่งซื้อ #${orderNumber}`,
    },
    preheader: {
      en: () => `We've received your payment proof.`,
      th: () => `เราได้รับใบเสร็จการชำระเงินของคุณแล้ว`,
    },
    body: {
      en: () => `Thank you for submitting your payment proof. We'll verify it and update your order status shortly.`,
      th: () => `ขอบคุณที่ส่งใบเสร็จการชำระเงิน เราจะตรวจสอบและอัปเดตสถานะคำสั่งซื้อของคุณในไม่ช้า`,
    },
  },
};

export type EmailTemplate = keyof typeof emailCopy;
