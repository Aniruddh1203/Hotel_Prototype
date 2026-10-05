const dotenv = require('dotenv');
dotenv.config();

const TARGET_WHATSAPP_NUMBER = process.env.NOTIFICATION_WHATSAPP || '9897960822';

/**
 * Format raw phone number into international E.164 format
 * Default to India (+91) if 10-digit number is provided.
 */
const formatPhoneNumber = (phone) => {
  const cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
};

/**
 * Generate formatted plain text message for WhatsApp
 */
const buildWhatsAppMessage = (booking) => {
  const {
    bookingId = 'BK-CONFIRMED',
    guestName = 'Guest',
    guestEmail = 'N/A',
    guestPhone = 'N/A',
    roomType = 'Luxury Suite',
    checkIn = 'N/A',
    checkOut = 'N/A',
    numberOfNights = 1,
    guests = { adults: 1, children: 0 },
    pricing = { totalAmount: 0, currency: 'USD' },
    specialRequests = 'None',
  } = booking;

  return `
🏨 *NEW HOTEL RESERVATION ALERT*

*Booking ID:* ${bookingId}
*Guest Name:* ${guestName}
*Email:* ${guestEmail}
*Phone:* ${guestPhone}

*Room / Suite:* ${roomType}
*Check-In:* ${checkIn}
*Check-Out:* ${checkOut} (${numberOfNights} Nights)
*Guests:* ${guests.adults || 1} Adults, ${guests.children || 0} Children

*Total Amount:* $${pricing.totalAmount || 0} ${pricing.currency || 'USD'}
*Special Requests:* ${specialRequests}

_The Moments Hotel & Resort Concierge System_
`.trim();
};

/**
 * Generate direct WhatsApp Web / App URL for instant one-click messaging
 */
const getWhatsAppUrl = (booking, targetPhone = TARGET_WHATSAPP_NUMBER) => {
  const formattedPhone = formatPhoneNumber(targetPhone);
  const messageText = buildWhatsAppMessage(booking);
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
};

/**
 * Send WhatsApp notification using Twilio API (if configured)
 * Fallbacks to generating WhatsApp web deep-link url.
 */
const sendWhatsAppAlert = async (booking, targetPhone = TARGET_WHATSAPP_NUMBER) => {
  const whatsappUrl = getWhatsAppUrl(booking, targetPhone);
  const messageText = buildWhatsAppMessage(booking);

  // Check if Twilio API credentials are provided in .env
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. "whatsapp:+14155238886"

  if (accountSid && authToken && fromNumber) {
    try {
      const twilio = require('twilio');
      const client = twilio(accountSid, authToken);
      const toFormatted = `whatsapp:+${formatPhoneNumber(targetPhone)}`;

      const message = await client.messages.create({
        from: fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`,
        to: toFormatted,
        body: messageText,
      });

      console.log(`📱 [WhatsApp Sent via Twilio]: Message SID ${message.sid} to ${toFormatted}`);
      return { success: true, sid: message.sid, whatsappUrl };
    } catch (error) {
      console.error('❌ [WhatsApp Twilio Error]:', error.message);
      return { success: false, error: error.message, whatsappUrl };
    }
  } else {
    console.log(`📱 [WhatsApp Alert Generated]: Direct link created for ${targetPhone}: ${whatsappUrl}`);
    return { success: true, whatsappUrl };
  }
};

module.exports = {
  sendWhatsAppAlert,
  getWhatsAppUrl,
  buildWhatsAppMessage,
};
