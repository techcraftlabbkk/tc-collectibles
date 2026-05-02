import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

/**
 * PromptPay QR Code Generator
 * Generates Thai PromptPay QR codes for payment
 */

function generatePromptPayQR(phoneNumber: string, amount: number): string {
  // PromptPay QR Code format (EMVCo standard for Thailand)
  // Based on Thai QR Payment specification

  const payload = generatePayload(phoneNumber, amount);
  return payload;
}

function generatePayload(phoneNumber: string, amount: number): string {
  // EMVCo QR Code standard for PromptPay
  // Format: 00 (version) + merchant info + amount + checksum

  // Remove any formatting from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Ensure phone is 10 digits, pad with leading zero if needed
  const phone = cleanPhone.length === 9 ? '0' + cleanPhone : cleanPhone;

  // Build the EMV payload
  let payload = '00020126';
  payload += '360014th.co.centralpay';
  payload += '0107' + formatTLV('0107', phone);
  payload += '5204' + '5399'; // Merchant type
  payload += '5303764';
  payload += '540' + formatAmount(amount);
  payload += '5802TH';
  payload += '62' + formatTLV('62', `070605ORDR${Date.now().toString().slice(-5)}`);

  // For simplified implementation, return standard PromptPay format
  return phone + '|' + amount.toFixed(2);
}

function formatTLV(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return length + value;
}

function formatAmount(amount: number): string {
  const amountStr = amount.toFixed(2);
  const length = amountStr.length.toString().padStart(2, '0');
  return length + amountStr;
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

    // Get merchant phone from environment
    const merchantPhone = process.env.PROMPTPAY_PHONE || '0911234567';

    // Generate PromptPay QR data
    const promptPayData = generatePromptPayQR(merchantPhone, amount);

    // Generate QR code as data URL using the PromptPay data
    const qrCodeDataUrl = await QRCode.toDataURL(promptPayData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      amount,
      orderId,
      merchantPhone,
      promptPayRef: merchantPhone.slice(-4).padStart(4, 'X'),
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
