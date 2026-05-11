import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

/**
 * PromptPay QR Code Generator
 * Implements Thai EMVCo QR standard (BOT specification)
 * https://www.bot.or.th/Thai/PaymentSystems/StandardPS/Documents/ThaiQRCode_PaymentStandard.pdf
 */

function buildTLV(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

/** CRC-16/CCITT-FALSE — the checksum algorithm required by Thai QR Payment spec */
function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generate a valid PromptPay EMVCo payload
 * phone: Thai mobile number in any common format (e.g. 0812345678, +66812345678)
 * amount: THB amount (include to generate a fixed-amount / dynamic QR)
 */
function generatePromptPayPayload(phone: string, amount: number): string {
  // Normalise to PromptPay proxy format: 0066XXXXXXXXX (13 digits)
  const digits = phone.replace(/\D/g, '');
  let proxy: string;
  if (digits.startsWith('66')) {
    proxy = '00' + digits; // already +66
  } else if (digits.startsWith('0')) {
    proxy = '006' + digits; // 0812345678 → 006 + 0812345678 → wait, should be 0066812345678
    proxy = '0066' + digits.slice(1); // strip leading 0, prepend 0066
  } else {
    proxy = '0066' + digits;
  }

  // Tag 29: PromptPay Merchant Account Info
  const merchantAccountInfo =
    buildTLV('00', 'A000000677010111') + // PromptPay GUID
    buildTLV('01', '01') +              // Proxy type: mobile number
    buildTLV('02', proxy);              // Proxy value

  // Build payload (without CRC)
  let payload =
    buildTLV('00', '01') +                          // Payload Format Indicator
    buildTLV('01', '12') +                          // Point of Initiation: 12 = dynamic (amount specified)
    buildTLV('29', merchantAccountInfo) +           // Merchant Account Info
    buildTLV('53', '764') +                         // Transaction Currency: THB
    buildTLV('54', amount.toFixed(2)) +             // Transaction Amount
    buildTLV('58', 'TH');                           // Country Code

  // CRC field: tag 63, length always 04, value = checksum of everything so far + "6304"
  payload += '6304';
  payload += crc16(payload);

  return payload;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount' },
        { status: 400 }
      );
    }

    const merchantPhone = process.env.PROMPTPAY_PHONE || '0809429441';

    // Build a valid PromptPay EMVCo payload
    const promptPayPayload = generatePromptPayPayload(merchantPhone, Number(amount));

    // Encode as QR image
    const qrCodeDataUrl = await QRCode.toDataURL(promptPayPayload, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Show last 4 digits of phone as the reference hint
    const digits = merchantPhone.replace(/\D/g, '');
    const promptPayRef = 'XX-XXXX-' + digits.slice(-4);

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      amount,
      orderId,
      merchantPhone,
      promptPayRef,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
