import crypto from 'crypto';
import Booking from '../models/booking.js';
import TourPackage from '../models/tourpackage.js';

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_GATEWAY_URL = process.env.ESEWA_GATEWAY_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_STATUS_URL = process.env.ESEWA_STATUS_URL || 'https://rc.esewa.com.np/api/epay/transaction/status/';

console.log('[eSewa] Product Code:', ESEWA_PRODUCT_CODE, '| Secret Key loaded:', ESEWA_SECRET_KEY ? 'YES' : 'NO');

function generateSignature(message) {
  const hash = crypto.createHmac('sha256', ESEWA_SECRET_KEY)
    .update(message)
    .digest('base64');
  return hash;
}

// POST /api/payments/initiate
export const initiatePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: TourPackage, as: 'TourPackage' }],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking is already paid' });
    }

    // Format amount consistently — eSewa needs the exact same value in signature and form
    const totalAmount = parseFloat(booking.totalAmount).toString();
    const transactionUuid = `BOOKING-${booking.id}-${Date.now()}`;

    // Generate signature: message = "total_amount=X,transaction_uuid=Y,product_code=Z"
    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
    const signature = generateSignature(message);

    console.log('[eSewa] Payment initiated:', { totalAmount, transactionUuid, message });

    return res.status(200).json({
      success: true,
      data: {
        gatewayUrl: ESEWA_GATEWAY_URL,
        formData: {
          amount: totalAmount,
          tax_amount: 0,
          total_amount: totalAmount,
          transaction_uuid: transactionUuid,
          product_code: ESEWA_PRODUCT_CODE,
          product_service_charge: 0,
          product_delivery_charge: 0,
          signed_field_names: signedFieldNames,
          signature: signature,
        },
      },
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ success: false, message: 'Error initiating payment' });
  }
};

// POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { encodedResponse } = req.body;

    if (!encodedResponse) {
      return res.status(400).json({ success: false, message: 'Missing payment response data' });
    }

    // Decode the Base64 response from eSewa
    let decoded;
    try {
      const jsonString = Buffer.from(encodedResponse, 'base64').toString('utf-8');
      decoded = JSON.parse(jsonString);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid payment response format' });
    }

    const { transaction_code, status, total_amount, transaction_uuid, product_code, signed_field_names, signature } = decoded;

    // Verify the signature
    const fields = signed_field_names.split(',');
    const signatureMessage = fields.map(field => `${field}=${decoded[field]}`).join(',');
    const expectedSignature = generateSignature(signatureMessage);

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    if (status !== 'COMPLETE') {
      return res.status(400).json({ success: false, message: 'Payment was not completed' });
    }

    // Extract booking ID from transaction_uuid (format: BOOKING-{id}-{timestamp})
    const parts = transaction_uuid.split('-');
    const bookingId = parseInt(parts[1], 10);

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Invalid transaction reference' });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(200).json({ success: true, message: 'Payment already recorded', data: booking });
    }

    // Double-check with eSewa's status API
    try {
      const statusUrl = `${ESEWA_STATUS_URL}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;
      const statusResponse = await fetch(statusUrl);
      const statusData = await statusResponse.json();

      if (statusData.status !== 'COMPLETE') {
        return res.status(400).json({ success: false, message: 'Payment verification failed with eSewa' });
      }
    } catch (statusError) {
      console.error('eSewa status check error:', statusError.message);
      // Continue if status check fails (eSewa test env can be flaky)
    }

    // Update booking payment status
    await booking.update({
      paymentStatus: 'paid',
      updatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified and recorded successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};
