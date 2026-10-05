const { transporter } = require('../config/mailer');

/**
 * Default Sender Address from environment variables
 */
const DEFAULT_FROM = process.env.EMAIL_FROM || '"The Moments Hotel" <no-reply@themomentshotel.com>';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@themomentshotel.com';
const COMPANY_NAME = process.env.COMPANY_NAME || 'The Moments Hotel & Resort';
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || '123 Luxury Boulevard, Paradise Bay, CA 90210';

/**
 * Format currency helper
 */
const formatMoney = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount || 0);
};

/**
 * Format date helper
 */
const formatDate = (dateInput) => {
  if (!dateInput) return new Date().toLocaleDateString('en-US', { dateStyle: 'full' });
  const date = new Date(dateInput);
  return isNaN(date.getTime())
    ? String(dateInput)
    : date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * ============================================================================
 * 1. USER LOGIN SECURITY ALERT EMAIL SERVICE
 * ============================================================================
 */

/**
 * Generates Plain-Text content for Login Security Alert
 */
const buildLoginAlertText = (details) => {
  const { userName = 'Valued Guest', timestamp, ipAddress = 'Unknown IP', userAgent = 'Unknown Device', location = 'Unknown Location' } = details;
  const timeStr = timestamp ? new Date(timestamp).toUTCString() : new Date().toUTCString();

  return `
SECURITY ALERT: New Session Login Detected

Dear ${userName},

We detected a new login to your ${COMPANY_NAME} account.

Login Details:
- Date & Time: ${timeStr}
- IP Address: ${ipAddress}
- Device / Browser: ${userAgent}
- Estimated Location: ${location}

If this was you, no action is required.
If you did not perform this login, please immediately reset your password or contact our support team at ${SUPPORT_EMAIL}.

Best regards,
Security Team | ${COMPANY_NAME}
${COMPANY_ADDRESS}
`.trim();
};

/**
 * Generates Cross-Client Responsive HTML for Login Security Alert
 */
const buildLoginAlertHtml = (details) => {
  const { userName = 'Valued Guest', timestamp, ipAddress = 'Unknown IP', userAgent = 'Unknown Device', location = 'Unknown Location' } = details;
  const timeStr = timestamp ? new Date(timestamp).toUTCString() : new Date().toUTCString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert: New Account Login</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 25px 30px; text-align: center;">
              <h1 style="color: #d4af37; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                ${COMPANY_NAME}
              </h1>
              <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 0.5px;">SECURITY & ACCOUNT ALERT</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px;">
              <!-- Alert Badge -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="background-color: #fffbe6; border: 1px solid #ffe58f; border-left: 4px solid #faad14; padding: 12px 16px; border-radius: 4px;">
                    <p style="margin: 0; color: #873800; font-size: 14px; font-weight: 600;">
                      🔒 Security Notification: New Session Sign-In
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-top: 0;">
                Hello <strong>${userName}</strong>,
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                We noticed a new sign-in to your account. Below are the details of the session activity:
              </p>

              <!-- Session Details Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin: 20px 0;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; width: 35%;">Date & Time</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; font-weight: 500;">${timeStr}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600;">IP Address</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; font-weight: 500; font-family: monospace;">${ipAddress}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600;">Device / Client</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 13px; font-weight: 500;">${userAgent}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #64748b; font-size: 13px; font-weight: 600;">Estimated Location</td>
                  <td style="padding: 12px 16px; color: #0f172a; font-size: 13px; font-weight: 500;">${location}</td>
                </tr>
              </table>

              <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                If this was you, you can safely ignore this email.
              </p>

              <!-- Warning Box / CTA -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
                <tr>
                  <td align="center" style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 18px; border-radius: 6px;">
                    <p style="color: #991b1b; font-size: 13px; margin: 0 0 12px 0; font-weight: 500;">
                      Wasn't you? Someone else might have access to your account.
                    </p>
                    <a href="mailto:${SUPPORT_EMAIL}?subject=Unauthorized%20Login%20Alert" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 13px; font-weight: 600; border-radius: 4px;">
                      Secure My Account Immediately
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br>
                ${COMPANY_ADDRESS}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
};

/**
 * Dispatch Security Alert Email for User Login
 * Non-blocking: Catches all errors internally so server code/routes never fail.
 *
 * @param {string} toEmail - Recipient email address
 * @param {Object} details - Object containing timestamp, ipAddress, userAgent, location, userName
 * @returns {Promise<Object>} Status object { success: boolean, messageId?: string, error?: string }
 */
const sendLoginAlert = async (toEmail, details = {}) => {
  try {
    if (!toEmail) {
      console.warn('⚠️ [Login Alert Skipped]: Missing recipient email address.');
      return { success: false, error: 'Recipient email missing' };
    }

    const mailOptions = {
      from: DEFAULT_FROM,
      to: toEmail,
      subject: `🔒 Security Alert: New Login to ${COMPANY_NAME}`,
      text: buildLoginAlertText(details),
      html: buildLoginAlertHtml(details),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Login Alert Sent]: Message ID ${info.messageId} to ${toEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [Login Alert Error]: Failed to send security email to ${toEmail}:`, error.message);
    // Return graceful failure status without throwing
    return { success: false, error: error.message };
  }
};


/**
 * ============================================================================
 * 2. HOTEL RESERVATION / BOOKING CONFIRMATION EMAIL SERVICE
 * ============================================================================
 */

/**
 * Generates Plain-Text content for Booking Confirmation
 */
const buildBookingConfirmationText = (booking) => {
  const {
    bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000),
    guestName = 'Valued Guest',
    hotelName = COMPANY_NAME,
    roomType = 'Luxury Suite',
    checkIn,
    checkOut,
    numberOfNights = 1,
    guests = { adults: 1, children: 0 },
    pricing = {},
    paymentStatus = 'CONFIRMED',
    specialRequests = 'None',
  } = booking;

  const totalAmountFormatted = formatMoney(pricing.totalAmount || 0, pricing.currency || 'USD');

  return `
BOOKING CONFIRMATION

Dear ${guestName},

Thank you for choosing ${hotelName}. Your reservation has been successfully confirmed!

RESERVATION SUMMARY:
----------------------------------------
Booking ID: ${bookingId}
Status: ${paymentStatus}
Hotel: ${hotelName}
Room Type: ${roomType}
Check-In Date: ${formatDate(checkIn)} (15:00 onwards)
Check-Out Date: ${formatDate(checkOut)} (11:00 AM)
Duration: ${numberOfNights} Night(s)
Guests: ${guests.adults || 1} Adult(s), ${guests.children || 0} Child(ren)
Special Requests: ${specialRequests}

PRICING DETAILS:
----------------------------------------
Room Rate: ${formatMoney(pricing.roomRate || 0, pricing.currency)}
Taxes & Fees: ${formatMoney(pricing.tax || 0, pricing.currency)}
Total Amount: ${totalAmountFormatted}

If you need to modify or cancel your booking, please contact our support team at ${SUPPORT_EMAIL}.

We look forward to welcoming you!

Warm regards,
Reservation Desk | ${COMPANY_NAME}
${COMPANY_ADDRESS}
`.trim();
};

/**
 * Generates Cross-Client Responsive HTML for Booking Confirmation
 */
const buildBookingConfirmationHtml = (booking) => {
  const {
    bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000),
    guestName = 'Valued Guest',
    hotelName = COMPANY_NAME,
    roomType = 'Luxury Suite',
    checkIn,
    checkOut,
    numberOfNights = 1,
    guests = { adults: 1, children: 0 },
    pricing = { roomRate: 0, tax: 0, totalAmount: 0, currency: 'USD' },
    paymentStatus = 'CONFIRMED',
    specialRequests = 'None',
  } = booking;

  const totalFormatted = formatMoney(pricing.totalAmount, pricing.currency);
  const roomRateFormatted = formatMoney(pricing.roomRate, pricing.currency);
  const taxFormatted = formatMoney(pricing.tax, pricing.currency);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - ${bookingId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
          
          <!-- Elegant Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 35px 30px; text-align: center;">
              <p style="color: #d4af37; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px 0; font-weight: 600;">Reservation Confirmed</p>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">${hotelName}</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0 0;">Confirmation Code: <strong style="color: #f8fafc; font-family: monospace;">${bookingId}</strong></p>
            </td>
          </tr>

          <!-- Banner Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin-top: 0;">
                Dear <strong>${guestName}</strong>,
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                We are delighted to confirm your upcoming stay at <strong>${hotelName}</strong>. Below are your booking details and receipt summary.
              </p>

              <!-- Stay Schedule Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 25px;">
                <tr>
                  <td width="50%" style="padding: 20px; border-right: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; font-weight: 600;">Check-In</p>
                    <p style="color: #0f172a; font-size: 15px; font-weight: 700; margin: 0 0 2px 0;">${formatDate(checkIn)}</p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">From 3:00 PM</p>
                  </td>
                  <td width="50%" style="padding: 20px; text-align: center;">
                    <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; font-weight: 600;">Check-Out</p>
                    <p style="color: #0f172a; font-size: 15px; font-weight: 700; margin: 0 0 2px 0;">${formatDate(checkOut)}</p>
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Until 11:00 AM</p>
                  </td>
                </tr>
              </table>

              <!-- Booking Details Breakdown -->
              <h3 style="color: #0f172a; font-size: 15px; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
                Reservation Breakdown
              </h3>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Accommodation:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">${roomType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Length of Stay:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">${numberOfNights} Night(s)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Guests:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">${guests.adults || 1} Adult(s), ${guests.children || 0} Child(ren)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="background-color: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; display: inline-block;">
                      ${paymentStatus}
                    </span>
                  </td>
                </tr>
                ${specialRequests && specialRequests !== 'None' ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Special Requests:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right;">${specialRequests}</td>
                </tr>` : ''}
              </table>

              <!-- Financial Summary Table -->
              <h3 style="color: #0f172a; font-size: 15px; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
                Payment Summary
              </h3>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Room Subtotal</td>
                  <td style="padding: 6px 0; color: #0f172a; font-size: 13px; text-align: right;">${roomRateFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Taxes & Service Fees</td>
                  <td style="padding: 6px 0; color: #0f172a; font-size: 13px; text-align: right;">${taxFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0 0; color: #0f172a; font-size: 15px; font-weight: 700; border-top: 1px dashed #cbd5e1;">Total Amount Paid</td>
                  <td style="padding: 10px 0 0 0; color: #d4af37; font-size: 17px; font-weight: 800; text-align: right; border-top: 1px dashed #cbd5e1;">${totalFormatted}</td>
                </tr>
              </table>

              <!-- Call to Action -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${SUPPORT_EMAIL}?subject=Reservation%20Inquiry%20${bookingId}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 6px; letter-spacing: 0.5px;">
                      Manage Reservation / Contact Support
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 25px 30px; text-align: center;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">
                Need assistance?
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.5;">
                Email us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #d4af37; text-decoration: none;">${SUPPORT_EMAIL}</a><br>
                &copy; ${new Date().getFullYear()} ${COMPANY_NAME}. ${COMPANY_ADDRESS}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
};

/**
 * Dispatch Booking Confirmation Email
 * Non-blocking: Catches all errors internally so server routes never fail or block.
 *
 * @param {string} toEmail - Recipient guest email address
 * @param {Object} bookingDetails - Complete booking reservation metadata
 * @returns {Promise<Object>} Status object { success: boolean, messageId?: string, error?: string }
 */
const sendBookingConfirmation = async (toEmail, bookingDetails = {}) => {
  try {
    if (!toEmail) {
      console.warn('⚠️ [Booking Confirmation Skipped]: Missing guest recipient email address.');
      return { success: false, error: 'Recipient email missing' };
    }

    const bookingId = bookingDetails.bookingId || 'BK-CONFIRMED';
    const mailOptions = {
      from: DEFAULT_FROM,
      to: toEmail,
      subject: `🏨 Booking Confirmation #${bookingId} - ${COMPANY_NAME}`,
      text: buildBookingConfirmationText(bookingDetails),
      html: buildBookingConfirmationHtml(bookingDetails),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Booking Confirmation Sent]: Message ID ${info.messageId} to ${toEmail} (Booking ID: ${bookingId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [Booking Confirmation Error]: Failed to send confirmation email to ${toEmail}:`, error.message);
    // Return graceful failure status without throwing
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendLoginAlert,
  sendBookingConfirmation,
};
