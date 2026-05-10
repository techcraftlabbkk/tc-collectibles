import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, customerName, orderId, shippingAddress } = body;

    if (!customerEmail || !customerName || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await emailService.sendShipmentEmail({
      orderId,
      customerEmail,
      customerName,
      orderTotal: 0, // Not needed for shipment email
      shippingAddress,
    });

    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error sending shipment email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
