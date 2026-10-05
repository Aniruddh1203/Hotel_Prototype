const { sendBookingConfirmation } = require('../services/emailService');
const { sendWhatsAppAlert, getWhatsAppUrl } = require('../services/whatsappService');

const PRIMARY_ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL || 'aniruddhranag143@gmail.com';
const PRIMARY_WHATSAPP_NUMBER = process.env.NOTIFICATION_WHATSAPP || '9897960822';

/**
 * Express Controller: Handle New Hotel Reservation / Booking
 * POST /api/bookings
 */
const createBooking = async (req, res) => {
  try {
    const { name, email, phone, arrival, departure, room, guests = 1, requests } = req.body;

    const guestName = name || req.body.guestName || 'Valued Guest';
    const guestEmail = email || req.body.guestEmail;
    const guestPhone = phone || req.body.guestPhone || PRIMARY_WHATSAPP_NUMBER;
    const checkIn = arrival || req.body.checkIn || new Date().toISOString().split('T')[0];
    const checkOut = departure || req.body.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const roomType = room || req.body.roomType || 'The Elite Vanguard';
    const specialRequests = requests || req.body.specialRequests || 'None';

    if (!guestEmail && !req.body.guestEmail) {
      return res.status(400).json({
        error: 'Missing required parameter: email is mandatory.',
      });
    }

    // 1. Calculate Stay Duration & Price
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.max(endDate - startDate, 86400000);
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let roomRatePerNight = 4200;
    if (roomType.includes('vanguard') || roomType.includes('Vanguard')) roomRatePerNight = 5000;
    if (roomType.includes('future') || roomType.includes('Orbital')) roomRatePerNight = 8500;

    const roomSubtotal = roomRatePerNight * numberOfNights;
    const taxAndFees = Math.round(roomSubtotal * 0.15 * 100) / 100;
    const totalAmount = roomSubtotal + taxAndFees;

    // 2. Create Booking Object
    const booking = {
      bookingId: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      guestName: guestName,
      guestEmail: guestEmail,
      guestPhone: guestPhone,
      hotelName: 'The Moments Hotel & Resort',
      roomType: roomType,
      checkIn: checkIn,
      checkOut: checkOut,
      numberOfNights: numberOfNights,
      guests: {
        adults: parseInt(guests, 10) || 1,
        children: 0,
      },
      pricing: {
        roomRate: roomSubtotal,
        tax: taxAndFees,
        totalAmount: totalAmount,
        currency: 'USD',
      },
      paymentStatus: 'CONFIRMED',
      specialRequests: specialRequests,
      createdAt: new Date().toISOString(),
    };

    // 3. ASYNCHRONOUS EMAIL DISPATCH TO BOTH ADMIN (aniruddhranag143@gmail.com) AND GUEST
    const emailRecipients = Array.from(new Set([PRIMARY_ADMIN_EMAIL, guestEmail])).filter(Boolean);

    emailRecipients.forEach((toAddress) => {
      sendBookingConfirmation(toAddress, booking).catch((err) => {
        console.error(`Background booking email to ${toAddress} failed:`, err);
      });
    });

    // 4. ASYNCHRONOUS WHATSAPP ALERT DISPATCH TO 9897960822
    const whatsappUrl = getWhatsAppUrl(booking, PRIMARY_WHATSAPP_NUMBER);
    sendWhatsAppAlert(booking, PRIMARY_WHATSAPP_NUMBER).catch((err) => {
      console.error(`Background WhatsApp alert to ${PRIMARY_WHATSAPP_NUMBER} failed:`, err);
    });

    // 5. Fast HTTP 201 Response
    return res.status(201).json({
      success: true,
      message: `Reservation confirmed! Details emailed to ${PRIMARY_ADMIN_EMAIL} and WhatsApp alert dispatched to ${PRIMARY_WHATSAPP_NUMBER}.`,
      booking: booking,
      notificationEmail: PRIMARY_ADMIN_EMAIL,
      notificationWhatsApp: PRIMARY_WHATSAPP_NUMBER,
      whatsappUrl: whatsappUrl,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Internal server error while processing reservation.' });
  }
};

module.exports = {
  createBooking,
};
