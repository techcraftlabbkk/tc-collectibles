/**
 * EmailLayout Component
 * Shared email template scaffold with customizable hero gradient and lead copy
 * Supports bilingual rendering (EN / TH)
 */

interface HeroGradient {
  from: string;
  to: string;
}

export interface EmailLayoutProps {
  heroGradient?: HeroGradient;
  heroLead: string;
  subject: string;
  children: React.ReactNode;
  locale?: 'en' | 'th';
  signoff?: string;
  preheader?: string;
}

/**
 * Default gradients for each template type
 */
export const HERO_GRADIENTS = {
  default: { from: '#667eea', to: '#764ba2' }, // Purple (existing default)
  order_shipped: { from: '#F59E0B', to: '#D97706' }, // Warm amber
  order_refunded: { from: '#64748B', to: '#475569' }, // Cool slate
} as const;

/**
 * EmailLayout component
 * @param heroGradient - Optional custom gradient. If not provided, uses default purple.
 * @param heroLead - Main heading text in the hero section
 * @param subject - Email subject line (for reference, not rendered in HTML)
 * @param children - Body content (JSX or HTML string)
 * @param locale - Language locale ('en' or 'th')
 * @param signoff - Optional sign-off line (e.g., "Thanks, TC Collectibles")
 * @param preheader - Optional preheader text (shown in email client preview)
 */
export const EmailLayout: React.FC<EmailLayoutProps> = ({
  heroGradient = HERO_GRADIENTS.default,
  heroLead,
  subject,
  children,
  locale = 'en',
  signoff,
  preheader,
}) => {
  const isRTL = locale === 'th'; // Thai uses RTL layout (adjust if needed)

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{subject}</title>
        {preheader && (
          <style>{`
            .preheader {
              display: none !important;
              visibility: hidden;
              mso-hide: all;
              font-size: 1px;
              line-height: 1px;
              max-height: 0;
              max-width: 0;
              opacity: 0;
              overflow: hidden;
            }
          `}</style>
        )}
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .hero {
            background: linear-gradient(135deg, ${heroGradient.from} 0%, ${heroGradient.to} 100%);
            color: white;
            padding: 40px 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
          }
          .hero h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            line-height: 1.3;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .content p {
            margin: 16px 0;
            color: #555;
          }
          .content h3 {
            margin: 24px 0 16px 0;
            color: #333;
            font-size: 18px;
          }
          .cta-button {
            display: inline-block;
            background: ${heroGradient.from};
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: opacity 0.2s;
          }
          .cta-button:hover {
            opacity: 0.9;
          }
          .signoff {
            font-style: italic;
            color: #666;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .footer {
            color: #999;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
          }
          .footer p {
            margin: 8px 0;
          }
        `}</style>
      </head>
      <body>
        {preheader && <div className="preheader">{preheader}</div>}

        <div className="container">
          {/* Hero Section */}
          <div className="hero">
            <h1>{heroLead}</h1>
          </div>

          {/* Main Content */}
          <div className="content">{children}</div>

          {/* Sign-off */}
          {signoff && <div className="signoff">{signoff}</div>}

          {/* Footer */}
          <div className="footer">
            <p>© 2026 TC Collectibles. All rights reserved.</p>
            <p>
              {locale === 'th'
                ? 'นี่คืออีเมลอัตโนมัติ โปรดอย่าตอบสนองอีเมลนี้'
                : 'This is an automated email. Please do not reply to this message.'}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailLayout;
