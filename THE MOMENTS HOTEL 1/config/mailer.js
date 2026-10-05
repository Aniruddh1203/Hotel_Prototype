const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Validates and retrieves required SMTP environment variables.
 */
const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn(
      '⚠️ [Mailer Config Warning]: SMTP_USER or SMTP_PASS environment variables are missing. Email delivery will operate in fallback mode or fail until valid credentials are provided.'
    );
  }

  return {
    host,
    port,
    secure, // true for 465, false for other ports (587, 2525)
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production', // Allow self-signed certs in dev if needed
    },
    pool: true, // Use pooled connections for better performance with concurrent email dispatches
    maxConnections: 5,
    maxMessages: 100,
  };
};

/**
 * Create Nodemailer Transporter instance
 */
const transporter = nodemailer.createTransport(getSmtpConfig());

/**
 * Verify transporter SMTP connectivity gracefully.
 * This can be called on server startup without blocking app execution.
 */
const verifyTransporter = async () => {
  try {
    const verified = await transporter.verify();
    if (verified) {
      console.log('✅ [Mailer]: SMTP Transporter verified successfully. Ready to dispatch emails.');
      return true;
    }
  } catch (error) {
    console.error('❌ [Mailer Error]: Transporter verification failed:', error.message);
    return false;
  }
};

module.exports = {
  transporter,
  verifyTransporter,
};
