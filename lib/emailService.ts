import nodemailer from 'nodemailer';

interface EmailTemplateData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderTotal: number;
  orderItems?: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
  orderDate?: string;
  status?: string;
}

// Email template generators
const emailTemplates = {
  orderConfirmation: (data: EmailTemplateData) => ({
    subject: `Order Confirmation - TC Collectibles #${data.orderId.slice(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { margin: 20px 0; }
          .order-item { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
          .total { font-size: 24px; font-weight: bold; color: #667eea; margin: 20px 0; }
          .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          .footer { color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Order! 🎉</h1>
          </div>

          <div class="content">
            <p>Hi ${data.customerName},</p>

            <p>Your order has been successfully placed! We're preparing your premium PSA Pokémon cards for shipment.</p>

            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #${data.orderId.slice(0, 8)}</p>
            <p><strong>Order Date:</strong> ${data.orderDate || new Date().toLocaleDateString()}</p>

            ${data.orderItems ? `
              <h3>Items</h3>
              ${data.orderItems.map(item => `
                <div class="order-item">
                  <div>
                    <strong>${item.title}</strong> (Qty: ${item.quantity})
                  </div>
                  <div>฿${(item.price * item.quantity).toLocaleString()}</div>
                </div>
              `).join('')}
            ` : ''}

            <div class="total">Total: ฿${data.orderTotal.toLocaleString()}</div>

            ${data.shippingAddress ? `
              <h3>Shipping Address</h3>
              <p>${data.shippingAddress}</p>
            ` : ''}

            <h3>Next Steps - Complete Your Payment</h3>
            <p>Your order is ready for payment. Please scan the PromptPay QR code to complete your transaction:</p>
            <a href="https://tc-collectibles.vercel.app/payment/${data.orderId}" class="button">Pay Now with PromptPay</a>

            <p style="margin-top: 20px; color: #666;">
              Click the button above to view your PromptPay QR code and complete the payment. Once we receive your payment confirmation, we'll begin processing and preparing your order for shipment.
            </p>
          </div>

          <div class="footer">
            <p>© 2026 TC Collectibles. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  paymentReceived: (data: EmailTemplateData) => ({
    subject: `Payment Received - TC Collectibles Order #${data.orderId.slice(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .success { color: #4caf50; font-size: 48px; margin: 20px 0; }
          .content { margin: 20px 0; }
          .footer { color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed! ✓</h1>
          </div>

          <div class="content">
            <p>Hi ${data.customerName},</p>

            <p>Great news! We've received your PromptPay payment for order #${data.orderId.slice(0, 8)}.</p>

            <div style="text-align: center;">
              <p style="font-size: 18px; color: #4caf50;">
                <strong>Payment Amount: ฿${data.orderTotal.toLocaleString()}</strong>
              </p>
              <p style="color: #666;">Payment Status: <strong>Verified</strong></p>
            </div>

            <h3>What's Next?</h3>
            <p>Your order is now being processed and prepared for shipment. You'll receive another email once your items have been shipped with tracking information.</p>

            <p style="color: #666;">
              Estimated shipping time: 2-5 business days
            </p>
          </div>

          <div class="footer">
            <p>© 2026 TC Collectibles. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  orderShipped: (data: EmailTemplateData) => ({
    subject: `Your Order Has Shipped! - TC Collectibles #${data.orderId.slice(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { margin: 20px 0; }
          .footer { color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order is On Its Way! 📦</h1>
          </div>

          <div class="content">
            <p>Hi ${data.customerName},</p>

            <p>Exciting news! Your order #${data.orderId.slice(0, 8)} has been shipped and is on its way to you.</p>

            <h3>Shipping Details</h3>
            <p>
              <strong>Destination:</strong> ${data.shippingAddress || 'Your address'}<br>
              <strong>Expected Delivery:</strong> 3-7 business days
            </p>

            <p style="color: #666;">
              You can track your shipment status anytime by visiting your orders page.
            </p>
          </div>

          <div class="footer">
            <p>© 2026 TC Collectibles. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  orderDelivered: (data: EmailTemplateData) => ({
    subject: `Your Order Has Been Delivered! - TC Collectibles #${data.orderId.slice(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { margin: 20px 0; }
          .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          .footer { color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order Has Arrived! 🎁</h1>
          </div>

          <div class="content">
            <p>Hi ${data.customerName},</p>

            <p>Your order #${data.orderId.slice(0, 8)} has been delivered! We hope you're delighted with your premium PSA Pokémon cards.</p>

            <h3>Your Order Summary</h3>
            <p><strong>Order Total:</strong> ฿${data.orderTotal.toLocaleString()}</p>

            <p style="color: #666; margin-top: 20px;">
              If you have any questions about your order, please don't hesitate to contact us. We'd love to hear your feedback!
            </p>

            <a href="https://tc-collectibles.vercel.app/products" class="button">Shop Again</a>
          </div>

          <div class="footer">
            <p>© 2026 TC Collectibles. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Email service class
class EmailService {
  private transporter: any;

  constructor() {
    // Initialize nodemailer transporter
    // In production, configure with your email provider (Gmail, SendGrid, Resend, etc.)
    const emailUser = process.env.SMTP_FROM;
    const emailPassword = process.env.SMTP_PASSWORD;

    if (emailUser && emailPassword) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });
    }
  }

  async sendOrderConfirmation(data: EmailTemplateData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('[EMAIL] Service not configured. Would send to:', data.customerEmail);
        return true;
      }

      const template = emailTemplates.orderConfirmation(data);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.customerEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log('[EMAIL] Order confirmation sent to:', data.customerEmail);
      return true;
    } catch (error) {
      console.error('[EMAIL] Failed to send order confirmation:', error);
      return false;
    }
  }

  async sendPaymentReceivedEmail(data: EmailTemplateData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('[EMAIL] Service not configured. Would send to:', data.customerEmail);
        return true;
      }

      const template = emailTemplates.paymentReceived(data);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.customerEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log('[EMAIL] Payment confirmation sent to:', data.customerEmail);
      return true;
    } catch (error) {
      console.error('[EMAIL] Failed to send payment confirmation:', error);
      return false;
    }
  }

  async sendShipmentEmail(data: EmailTemplateData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('[EMAIL] Service not configured. Would send to:', data.customerEmail);
        return true;
      }

      const template = emailTemplates.orderShipped(data);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.customerEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log('[EMAIL] Shipment notification sent to:', data.customerEmail);
      return true;
    } catch (error) {
      console.error('[EMAIL] Failed to send shipment email:', error);
      return false;
    }
  }

  async sendDeliveryEmail(data: EmailTemplateData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('[EMAIL] Service not configured. Would send to:', data.customerEmail);
        return true;
      }

      const template = emailTemplates.orderDelivered(data);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: data.customerEmail,
        subject: template.subject,
        html: template.html,
      });

      console.log('[EMAIL] Delivery confirmation sent to:', data.customerEmail);
      return true;
    } catch (error) {
      console.error('[EMAIL] Failed to send delivery email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
export { EmailTemplateData };
